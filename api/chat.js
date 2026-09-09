// ============================================================
//  ShilpGram — /api/chat  (Vercel Serverless Function)
//  Gemini REST via Node built-in https. No npm deps.
//  API key lives in process.env.GEMINI_API_KEY only.
// ============================================================

"use strict";

const https = require("https");

// Keep the model configurable, but use a model name supported by the Gemini
// generateContent API when no deployment override is provided.
const MODEL    = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_MSG  = 2000;
const MAX_HIST = 20; // max history turns to process

// ----------------------------------------------------------------
// ShilpGram system instruction
// ----------------------------------------------------------------
const SYSTEM_INSTRUCTION = `You are the official ShilpGram Assistant — the AI guide for ShilpGram, India's national digital artisan business ecosystem.

IDENTITY:
- Your name is "ShilpGram Assistant"
- You are warm, professional, trustworthy, encouraging, and concise
- You speak simply enough for artisans who may not be highly technical
- You do NOT say "As an AI..." repeatedly
- You do NOT claim to be human
- You use natural, conversational language
- You adapt your tone depending on whether the user appears to be an artisan, a buyer/business, a government/ecosystem stakeholder, or a general visitor

WHAT SHILPGRAM IS:
ShilpGram is building India's national artisan business ecosystem. Its core mission is "From Skilled Artisan to Successful Entrepreneur." ShilpGram provides India's artisans with digital business infrastructure that connects digital identity, government schemes, training, branding, marketplace access, finance, insurance, export support, business development, and AI-powered design inspiration — all in one connected ecosystem.

THE EIGHT MODULES:
1. Digital Business Account — A verified digital identity for every artisan. The foundation that lets artisans open credit, sign contracts, and be discovered by buyers as a real business, not an informal producer.
2. Branding & Packaging — Professional brand identity, packaging design, product photography, storytelling, digital catalogue, business registration, GST compliance, and business consultancy support.
3. Marketplace — Direct B2B and B2C market access connecting artisans straight to hotels, interior designers, architects, retail chains, export houses, government procurement, corporate gifting, and individual buyers — with no middlemen.
4. Finance & Insurance — Working-capital credit and insurance products designed around an artisan's real income cycle, improving access to formal financial services and relevant protection.
5. Export Support — End-to-end export documentation, compliance, and logistics support so artisan businesses can explore selling into international markets.
6. Training Academy — Structured business learning and mentorship covering pricing, digital marketing, financial literacy, export readiness, business skills, and mentorship — built specifically for artisan entrepreneurs.
7. AI Design Studio — AI-assisted tools that help artisans create new product variations, patterns, and collections while staying true to their craft traditions and exploring new design ideas.
8. Government Scheme Hub — One window to discover, apply for, and track government schemes. Covers PM Vishwakarma, PMEGP, MUDRA, ODOP, SFURTI, and NHDP & NLDP. The workflow includes: Eligibility → Documentation → Application → Tracking → Renewal.

WHO SHILPGRAM SERVES:
- Artisans: Help build formal business identities, improve branding, access markets, learn business skills, discover schemes, and explore finance/export opportunities.
- Businesses & Buyers: Help discover artisan products and explore B2B/B2C sourcing opportunities (hotels, interior designers, architects, retail, export houses, corporate gifting).
- Government & Ecosystem: Help connect artisan development initiatives with a more structured digital ecosystem.

CONTACT INFORMATION:
- Email: globalexpressgroup@gmail.com
- Phone: 96505 60277 / 99101 96123
- Address: 13, Institutional Area, Lodhi Road, New Delhi 110003

WEBSITE PAGES (direct users here):
- Home: index.html
- Ecosystem: ecosystem.html
- Solutions: solutions.html
- Business (funding/roadmap): business.html
- Join the Ecosystem: via the "Join the Ecosystem" button on the website (Google Form)

IMPORTANT RULES:
1. NEVER invent ShilpGram features, partnerships, prices, scheme eligibility, financial approvals, buyer orders, government approvals, application statuses, or guarantees.
2. NEVER say "You are definitely eligible" — eligibility depends on the scheme requirements and individual profile, location, craft, and circumstances.
3. NEVER promise loan approval, guaranteed financing, insurance approval, specific interest rates, or specific loan amounts.
4. NEVER guarantee international buyers, export orders, or export/customs approval.
5. NEVER claim "You will definitely get buyers" — say "designed to help connect you with buyers."
6. If information is unavailable, say: "I don't have enough information about that yet. I can help you explore the services available on the ShilpGram website."
7. Do NOT invent subsidy amounts, loan amounts, approval dates, or government partnerships.
8. Keep responses concise and genuinely useful.
9. Guide users toward the relevant ShilpGram page or the Join/Contact functionality where appropriate.`;

// ----------------------------------------------------------------
// Make HTTPS request — returns { statusCode, body }
// ----------------------------------------------------------------
function httpsPost(hostname, path, payload) {
    return new Promise(function (resolve, reject) {
        const bodyStr = JSON.stringify(payload);

        const options = {
            hostname,
            path,
            method: "POST",
            headers: {
                "Content-Type":   "application/json",
                "Content-Length": Buffer.byteLength(bodyStr)
            }
        };

        const req = https.request(options, function (res) {
            let raw = "";
            res.on("data", function (chunk) { raw += chunk; });
            res.on("end", function () {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(raw) });
                } catch (e) {
                    reject(new Error("JSON parse failed: " + raw.slice(0, 120)));
                }
            });
        });

        req.on("error", reject);
        req.setTimeout(28000, function () {
            req.destroy(new Error("Gemini request timed out"));
        });

        req.write(bodyStr);
        req.end();
    });
}

// ----------------------------------------------------------------
// Extract text reply from Gemini response
// ----------------------------------------------------------------
function extractText(body) {
    try {
        const text = body.candidates[0].content.parts[0].text;
        return typeof text === "string" && text.trim() ? text.trim() : null;
    } catch (_) {
        return null;
    }
}

// ----------------------------------------------------------------
// CORS headers helper
// ----------------------------------------------------------------
function cors(res) {
    res.setHeader("Access-Control-Allow-Origin",  "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ----------------------------------------------------------------
// Friendly error response
// ----------------------------------------------------------------
const FALLBACK_REPLY = "I'm having a little trouble connecting right now. You can try again in a moment, or explore the ShilpGram website directly.";

// ================================================================
// MAIN HANDLER
// ================================================================
module.exports = async function handler(req, res) {
    cors(res);

    // ── Preflight ──────────────────────────────────────────────
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // ── Health-check (GET /api/chat) ───────────────────────────
    if (req.method === "GET") {
        const hasKey = !!(process.env.GEMINI_API_KEY);
        return res.status(200).json({
            ok: true,
            model: MODEL,
            keyConfigured: hasKey
        });
    }

    // ── Only POST beyond this point ────────────────────────────
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, reply: "Method not allowed." });
    }

    // ── API key guard ──────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        console.error("[ShilpGram/chat] GEMINI_API_KEY is missing or is the placeholder value.");
        return res.status(200).json({ success: false, reply: "The AI assistant is not configured yet. Please set up the API key." });
    }

    // ── Parse request body ─────────────────────────────────────
    let message, history;
    try {
        // Vercel already parses JSON bodies when Content-Type: application/json
        const b = (req.body && typeof req.body === "object") ? req.body : JSON.parse(req.body || "{}");
        message = (b.message || "").toString().trim();
        history = Array.isArray(b.history) ? b.history : [];
    } catch (e) {
        console.error("[ShilpGram/chat] Body parse error:", e.message);
        return res.status(400).json({ success: false, reply: "Invalid request body." });
    }

    // ── Validate message ───────────────────────────────────────
    if (!message) {
        return res.status(400).json({ success: false, reply: "Message is required." });
    }
    if (message.length > MAX_MSG) {
        return res.status(400).json({ success: false, reply: "Your message is too long. Please shorten it." });
    }

    // ── Build Gemini contents array ────────────────────────────
    // Keep last N history pairs, map "assistant" → "model"
    const trimmed = history.slice(-MAX_HIST);
    const contents = [
        ...trimmed.map(function (turn) {
            return {
                role:  turn.role === "assistant" ? "model" : "user",
                parts: [{ text: String(turn.content || "").slice(0, 1500) }]
            };
        }),
        { role: "user", parts: [{ text: message }] }
    ];

    // ── Gemini request payload ─────────────────────────────────
    const payload = {
        system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents,
        generationConfig: {
            temperature:     0.7,
            maxOutputTokens: 700,
            topP:            0.95
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
        ]
    };

    const apiPath = `/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    // ── Call Gemini ────────────────────────────────────────────
    try {
        const { statusCode, body: geminiBody } = await httpsPost(
            "generativelanguage.googleapis.com",
            apiPath,
            payload
        );

        // Log non-200 for Vercel logs (key is NOT logged)
        if (statusCode !== 200) {
            const errSnippet = JSON.stringify(geminiBody).slice(0, 300);
            console.error(`[ShilpGram/chat] Gemini ${statusCode}: ${errSnippet}`);

            // Pass Gemini's own error message through safely (no key leakage)
            const geminiMsg = geminiBody?.error?.message || null;
            const safeMsg = geminiMsg && !geminiMsg.includes(apiKey)
                ? `Gemini error: ${geminiMsg}`
                : FALLBACK_REPLY;

            return res.status(200).json({ success: false, reply: FALLBACK_REPLY, _debug: safeMsg });
        }

        const reply = extractText(geminiBody);

        if (!reply) {
            const bodySnippet = JSON.stringify(geminiBody).slice(0, 300);
            console.error("[ShilpGram/chat] Could not extract reply. Body:", bodySnippet);
            return res.status(200).json({ success: false, reply: FALLBACK_REPLY });
        }

        return res.status(200).json({ success: true, reply });

    } catch (err) {
        console.error("[ShilpGram/chat] Unexpected error:", err.message);
        return res.status(200).json({ success: false, reply: FALLBACK_REPLY });
    }
};
