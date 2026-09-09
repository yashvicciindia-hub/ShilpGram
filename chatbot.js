
(function () {
    "use strict";

    var chatbotState = {
        isOpen: false,
        isLoading: false,
        history: [],           // { role: "user"|"assistant", content: string }
        welcomeShown: false
    };

    var MAX_HISTORY_ITEMS = 20;  // items stored in localStorage
    var HISTORY_SEND_LIMIT = 10; // items sent to API (last N)
    var GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeJa92gdINQcT2rEuV-wA7fbIERE0CSUfP_N_U7TEH6GlvYfg/viewform?usp=publish-editor";

    // ----------------------------------------------------------------
    // Quick-reply definitions per context
    // ----------------------------------------------------------------
    var QUICK_REPLIES = {
        welcome: [
            { label: "I'm an Artisan", msg: "I'm an artisan. How can ShilpGram help me?" },
            { label: "I'm a Buyer", msg: "I'm a buyer looking to source artisan products." },
            { label: "Government Schemes", msg: "What government schemes does ShilpGram cover?" },
            { label: "How ShilpGram Works", msg: "How does ShilpGram work?" },
            { label: "Marketplace", msg: "Tell me about the ShilpGram marketplace." },
            { label: "Join ShilpGram", msg: "How can I join ShilpGram?" },
            { label: "Contact ShilpGram", msg: "How can I contact ShilpGram?" }
        ],
        schemes: [
            { label: "PM Vishwakarma", msg: "What is PM Vishwakarma?" },
            { label: "PMEGP", msg: "What is PMEGP?" },
            { label: "MUDRA", msg: "What is MUDRA?" },
            { label: "How to Apply", msg: "How can ShilpGram help me apply for a government scheme?" }
        ],
        marketplace: [
            { label: "I'm an Artisan", msg: "I'm an artisan. How do I sell on the marketplace?" },
            { label: "I'm a Buyer", msg: "I'm a buyer. How can I source from the marketplace?" },
            { label: "How Marketplace Works", msg: "How does the ShilpGram marketplace work?" }
        ],
        join: [
            { label: "Join as Artisan", msg: "I want to join ShilpGram as an artisan." },
            { label: "Join as Buyer", msg: "I want to join ShilpGram as a buyer." }
        ]
    };

    // ----------------------------------------------------------------
    // Fallback responses (when Gemini is unavailable)
    // ----------------------------------------------------------------
    var FALLBACKS = [
        {
            keywords: ["what is shilpgram", "about shilpgram", "what does shilpgram do"],
            reply: "ShilpGram is building India's national digital artisan business ecosystem. Our mission is to take artisans **From Skilled Artisan to Successful Entrepreneur** — by connecting digital identity, government schemes, training, branding, marketplace, finance, and export support into one platform. You can explore more on our <a href=\"ecosystem.html\">Ecosystem page</a>."
        },
        {
            keywords: ["artisan", "i am an artisan", "i'm an artisan", "help me as artisan"],
            reply: "ShilpGram helps artisans build a verified digital business identity, access government schemes like PM Vishwakarma, develop branding, sell through our marketplace, get finance, and explore export opportunities. Which area would you like to know more about — schemes, marketplace, branding, or training?"
        },
        {
            keywords: ["buyer", "i'm a buyer", "source", "sourcing", "procure", "hotel", "corporate"],
            reply: "ShilpGram's marketplace is designed to connect businesses and buyers directly with verified artisan products. Buyer categories include hotels, interior designers, architects, retail chains, export houses, corporate gifting, and government procurement. Visit our <a href=\"solutions.html\">Solutions page</a> to learn more."
        },
        {
            keywords: ["government scheme", "scheme", "pm vishwakarma", "pmegp", "mudra", "odop", "sfurti", "nhdp", "nldp"],
            reply: "ShilpGram's Government Scheme Hub covers: PM Vishwakarma, PMEGP, MUDRA, ODOP, SFURTI, and NHDP & NLDP. The workflow helps you through eligibility check, documentation, application, tracking, and renewal. Eligibility depends on your craft, location, and individual circumstances."
        },
        {
            keywords: ["marketplace", "sell", "market", "buy"],
            reply: "ShilpGram's marketplace is designed to provide direct B2B and B2C market access — connecting artisans with hotels, interior designers, retail chains, export houses, and individual buyers, with no middlemen. Visit our <a href=\"solutions.html#marketplace\">Solutions page</a> to learn more."
        },
        {
            keywords: ["join", "register", "sign up", "how to join"],
            reply: "To join ShilpGram, click the **Join the Ecosystem** button on our website and fill out the Google Form with your details. This is the first step to building your digital artisan business identity with us."
        },
        {
            keywords: ["contact", "reach", "email", "phone", "address", "location"],
            reply: "You can reach ShilpGram at:\n📧 globalexpressgroup@gmail.com\n📞 96505 60277 / 99101 96123\n📍 13, Institutional Area, Lodhi Road, New Delhi 110003"
        },
        {
            keywords: ["training", "learn", "course", "mentorship", "academy"],
            reply: "ShilpGram's Training Academy provides structured business learning and mentorship covering pricing, digital marketing, financial literacy, export readiness, and business skills — built specifically for artisan entrepreneurs."
        },
        {
            keywords: ["finance", "loan", "insurance", "credit", "capital"],
            reply: "ShilpGram's Finance & Insurance module is designed to improve access to working-capital credit and insurance products suited to an artisan's income cycle. Please note we cannot guarantee loan approval or specific amounts — these depend on individual circumstances and lender criteria."
        },
        {
            keywords: ["export", "international", "global"],
            reply: "ShilpGram's Export Support module is designed to help artisans become export-ready with documentation, compliance, and logistics guidance. We cannot guarantee international buyers or export orders, but we aim to support your export readiness journey."
        },
        {
            keywords: ["branding", "packaging", "logo", "design", "photography"],
            reply: "ShilpGram's Branding & Packaging module supports professional brand identity, packaging design, product photography, storytelling, digital catalogue, business registration, GST compliance, and business consultancy. Visit our <a href=\"solutions.html#branding\">Solutions page</a> for details."
        },
        {
            keywords: ["ai design", "ai studio", "design studio", "product design"],
            reply: "ShilpGram's AI Design Studio provides AI-assisted tools to help artisans explore new product variations, patterns, and collections while staying true to their craft traditions. It's about design inspiration and exploration."
        },
        {
            keywords: ["digital identity", "digital account", "business account", "identity"],
            reply: "ShilpGram's Digital Business Account gives every artisan a verified digital identity — the foundation for accessing credit, signing contracts, applying for government schemes, and being discovered by buyers as a real business."
        }
    ];

   
    function getFallbackResponse(msg) {
        var lower = msg.toLowerCase();
        for (var i = 0; i < FALLBACKS.length; i++) {
            var fb = FALLBACKS[i];
            for (var j = 0; j < fb.keywords.length; j++) {
                if (lower.indexOf(fb.keywords[j]) !== -1) {
                    return fb.reply;
                }
            }
        }
        return "I'm having a little trouble connecting right now. You can try again in a moment, or explore the information on the <a href=\"index.html\">ShilpGram website</a>. You can also reach us at <a href=\"mailto:globalexpressgroup@gmail.com\">globalexpressgroup@gmail.com</a>.";
    }

    // ----------------------------------------------------------------
    // DOM References (populated after inject)
    // ----------------------------------------------------------------
    var el = {};

    // ----------------------------------------------------------------
    // Inject chatbot HTML into body
    // ----------------------------------------------------------------
    function injectHTML() {
        var div = document.createElement("div");
        div.innerHTML = [
            // Launcher button
            '<button class="sg-chat-launcher" id="sgChatLauncher" aria-label="Open ShilpGram Assistant" aria-expanded="false">',
            '  <span class="sg-chat-launcher-icon" aria-hidden="true">',
            '    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">',
            '      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.53 1.14 4.83 2.99 6.46L4 21l4.04-1.35C9.27 20.2 10.6 20.5 12 20.5c5.52 0 10-4.03 10-9S17.52 2 12 2z" fill="currentColor"/>',
            '      <circle cx="8.5" cy="11" r="1.2" fill="white" opacity="0.9"/>',
            '      <circle cx="12" cy="11" r="1.2" fill="white" opacity="0.9"/>',
            '      <circle cx="15.5" cy="11" r="1.2" fill="white" opacity="0.9"/>',
            '    </svg>',
            '  </span>',
            '  <span class="sg-chat-launcher-pulse" aria-hidden="true"></span>',
            '</button>',

            // Chat window
            '<div class="sg-chat-window" id="sgChatWindow" aria-hidden="true" role="dialog" aria-modal="false" aria-label="ShilpGram Assistant">',
            '  <div class="sg-chat-header">',
            '    <div class="sg-chat-header-info">',
            '      <div class="sg-chat-avatar" aria-hidden="true">✦</div>',
            '      <div>',
            '        <div class="sg-chat-title">ShilpGram Assistant</div>',
            '        <div class="sg-chat-status"><span class="sg-status-dot" aria-hidden="true"></span><span id="sgStatusText">Online</span></div>',
            '      </div>',
            '    </div>',
            '    <div class="sg-chat-header-actions">',
            '      <button class="sg-chat-icon-btn" id="sgClearBtn" aria-label="Clear chat history" title="Clear chat">',
            '        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>',
            '      </button>',
            '      <button class="sg-chat-icon-btn" id="sgCloseBtn" aria-label="Close ShilpGram Assistant">',
            '        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
            '      </button>',
            '    </div>',
            '  </div>',

            '  <div class="sg-chat-messages" id="sgChatMessages" role="log" aria-live="polite" aria-relevant="additions">',
            '    <!-- messages injected here -->',
            '  </div>',

            '  <div class="sg-chat-typing" id="sgChatTyping" aria-live="polite" aria-hidden="true">',
            '    <div class="sg-typing-bubble">',
            '      <span class="sg-dot"></span>',
            '      <span class="sg-dot"></span>',
            '      <span class="sg-dot"></span>',
            '    </div>',
            '  </div>',

            '  <div class="sg-chat-input-row">',
            '    <textarea',
            '      class="sg-chat-input"',
            '      id="sgChatInput"',
            '      placeholder="Ask me anything about ShilpGram…"',
            '      aria-label="Type your message"',
            '      rows="1"',
            '      maxlength="2000"',
            '    ></textarea>',
            '    <button class="sg-chat-send" id="sgSendBtn" aria-label="Send message">',
            '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">',
            '        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
            '      </svg>',
            '    </button>',
            '  </div>',
            '</div>'
        ].join("\n");

        document.body.appendChild(div.firstElementChild); // launcher
        document.body.appendChild(div.lastElementChild);  // window

        // Cache references
        el.launcher = document.getElementById("sgChatLauncher");
        el.window   = document.getElementById("sgChatWindow");
        el.messages = document.getElementById("sgChatMessages");
        el.typing   = document.getElementById("sgChatTyping");
        el.input    = document.getElementById("sgChatInput");
        el.sendBtn  = document.getElementById("sgSendBtn");
        el.clearBtn = document.getElementById("sgClearBtn");
        el.status   = document.getElementById("sgStatusText");
    }

    // ----------------------------------------------------------------
    // Open / Close
    // ----------------------------------------------------------------
    function openChat() {
        if (chatbotState.isOpen) return;
        chatbotState.isOpen = true;
        el.window.classList.add("sg-chat-open");
        el.window.setAttribute("aria-hidden", "false");
        el.launcher.setAttribute("aria-expanded", "true");
        el.launcher.classList.add("sg-launcher-active");
        setTimeout(function () { el.input.focus(); }, 320);

        // Show welcome on first open (or if no history)
        if (!chatbotState.welcomeShown && chatbotState.history.length === 0) {
            showWelcome();
        }
    }

    function closeChat() {
        if (!chatbotState.isOpen) return;
        chatbotState.isOpen = false;
        el.window.classList.remove("sg-chat-open");
        el.window.setAttribute("aria-hidden", "true");
        el.launcher.setAttribute("aria-expanded", "false");
        el.launcher.classList.remove("sg-launcher-active");
        el.launcher.focus();
    }

    // ----------------------------------------------------------------
    // Welcome screen
    // ----------------------------------------------------------------
    function showWelcome() {
        chatbotState.welcomeShown = true;

        // Welcome message bubble
        var welcomeText = "Namaste! 👋\nI'm the ShilpGram Assistant.\n\nI can help you explore ShilpGram, government schemes, marketplace opportunities, training, branding, finance, exports and more. What brings you here today?";
        renderMessage("assistant", welcomeText);

        // Quick reply buttons
        renderQuickReplies(QUICK_REPLIES.welcome);
    }

    // ----------------------------------------------------------------
    // Render a message bubble
    // ----------------------------------------------------------------
    function renderMessage(role, text) {
        var item = document.createElement("div");
        item.className = "sg-msg sg-msg-" + role;

        var bubble = document.createElement("div");
        bubble.className = "sg-msg-bubble";
        bubble.innerHTML = formatText(text);

        item.appendChild(bubble);
        el.messages.appendChild(item);
        scrollToBottom();
        return item;
    }

    // ----------------------------------------------------------------
    // Format text: newlines → <br>, **bold**, bullet lists, links
    // ----------------------------------------------------------------
    function formatText(text) {
        // Escape HTML (except for pre-existing safe HTML we write ourselves)
        var escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Restore safe anchor tags (from fallbacks)
        escaped = escaped.replace(/&lt;a href="([^"]+)"&gt;([^&]+)&lt;\/a&gt;/g, '<a href="$1" rel="noopener">$2</a>');

        // Bold: **text**
        escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

        // Bullet list: lines starting with - or •
        var lines = escaped.split("\n");
        var result = [];
        var inList = false;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var bulletMatch = line.match(/^[-•]\s+(.+)$/);
            if (bulletMatch) {
                if (!inList) { result.push("<ul>"); inList = true; }
                result.push("<li>" + bulletMatch[1] + "</li>");
            } else {
                if (inList) { result.push("</ul>"); inList = false; }
                result.push(line === "" ? "<br>" : "<p>" + line + "</p>");
            }
        }
        if (inList) result.push("</ul>");

        return result.join("");
    }

    // ----------------------------------------------------------------
    // Render quick reply buttons
    // ----------------------------------------------------------------
    function renderQuickReplies(replies) {
        if (!replies || !replies.length) return;
        var row = document.createElement("div");
        row.className = "sg-quick-replies";
        replies.forEach(function (r) {
            var btn = document.createElement("button");
            btn.className = "sg-quick-btn";
            btn.textContent = r.label;
            btn.type = "button";
            btn.setAttribute("aria-label", r.label);
            btn.addEventListener("click", function () {
                // Remove the quick reply row
                if (row.parentNode) row.parentNode.removeChild(row);
                handleQuickReply(r.msg);
            });
            row.appendChild(btn);
        });
        el.messages.appendChild(row);
        scrollToBottom();
    }

    // ----------------------------------------------------------------
    // Handle quick reply — fires through normal send path
    // ----------------------------------------------------------------
    function handleQuickReply(msg) {
        sendMessage(msg);
    }

    // ----------------------------------------------------------------
    // Send a message (from input or quick reply)
    // ----------------------------------------------------------------
    function sendMessage(overrideText) {
        if (chatbotState.isLoading) return;

        var text = overrideText || el.input.value.trim();
        if (!text) return;

        // Clear input if it came from input box
        if (!overrideText) {
            el.input.value = "";
            autoResize(el.input);
        }

        // Remove any existing quick reply rows
        var existingQR = el.messages.querySelectorAll(".sg-quick-replies");
        existingQR.forEach(function (qr) { qr.parentNode && qr.parentNode.removeChild(qr); });

        // Render user message
        renderMessage("user", text);

        // Add to history
        chatbotState.history.push({ role: "user", content: text });
        pruneHistory();

        // Disable input
        setLoading(true);

        // Call API
        sendToGemini(text).then(function (reply) {
            hideTyping();
            renderMessage("assistant", reply);
            chatbotState.history.push({ role: "assistant", content: reply });
            pruneHistory();
            saveHistory();
            setLoading(false);

            // Show contextual quick replies
            showContextualReplies(text, reply);
        }).catch(function () {
            hideTyping();
            var fallback = getFallbackResponse(text);
            renderMessage("assistant", fallback);
            chatbotState.history.push({ role: "assistant", content: fallback });
            pruneHistory();
            saveHistory();
            setLoading(false);
        });
    }

    // ----------------------------------------------------------------
    // Call /api/chat (secure proxy)
    // ----------------------------------------------------------------
    function sendToGemini(message) {
        showTyping();

        // Send last N history items (excluding current message already pushed)
        var historyToSend = chatbotState.history.slice(0, -1).slice(-HISTORY_SEND_LIMIT);

        return fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message, history: historyToSend })
        })
        .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(function (data) {
            if (data && data.success === true && data.reply) return data.reply;
            throw new Error("No reply");
        })
        .catch(function () {
            return getFallbackResponse(message);
        });
    }

    // ----------------------------------------------------------------
    // Contextual quick replies after a response
    // ----------------------------------------------------------------
    function showContextualReplies(userMsg, assistantReply) {
        var lower = (userMsg + " " + assistantReply).toLowerCase();
        if (lower.indexOf("scheme") !== -1 || lower.indexOf("vishwakarma") !== -1 || lower.indexOf("pmegp") !== -1 || lower.indexOf("mudra") !== -1) {
            renderQuickReplies(QUICK_REPLIES.schemes);
        } else if (lower.indexOf("marketplace") !== -1 || lower.indexOf("sell") !== -1 || lower.indexOf("buyer") !== -1) {
            renderQuickReplies(QUICK_REPLIES.marketplace);
        } else if (lower.indexOf("join") !== -1 || lower.indexOf("register") !== -1) {
            renderQuickReplies(QUICK_REPLIES.join);
        }
    }

    // ----------------------------------------------------------------
    // Typing indicator
    // ----------------------------------------------------------------
    function showTyping() {
        el.typing.setAttribute("aria-hidden", "false");
        el.typing.classList.add("sg-typing-show");
        scrollToBottom();
    }

    function hideTyping() {
        el.typing.setAttribute("aria-hidden", "true");
        el.typing.classList.remove("sg-typing-show");
    }

    // ----------------------------------------------------------------
    // Loading state
    // ----------------------------------------------------------------
    function setLoading(val) {
        chatbotState.isLoading = val;
        el.sendBtn.disabled = val;
        el.input.disabled = val;
        el.status.textContent = val ? "Typing…" : "Online";
    }

    // ----------------------------------------------------------------
    // Clear chat
    // ----------------------------------------------------------------
    function clearChat() {
        chatbotState.history = [];
        chatbotState.welcomeShown = false;
        el.messages.innerHTML = "";
        hideTyping();
        setLoading(false);
        try { localStorage.removeItem("sg_chat_history"); } catch (e) {}
        showWelcome();
    }

    // ----------------------------------------------------------------
    // History persistence
    // ----------------------------------------------------------------
    function saveHistory() {
        try {
            localStorage.setItem("sg_chat_history", JSON.stringify(chatbotState.history.slice(-MAX_HISTORY_ITEMS)));
        } catch (e) {}
    }

    function loadHistory() {
        try {
            var stored = localStorage.getItem("sg_chat_history");
            if (stored) {
                var parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    chatbotState.history = parsed.slice(-MAX_HISTORY_ITEMS);
                    return true;
                }
            }
        } catch (e) {}
        return false;
    }

    function restoreHistoryUI() {
        chatbotState.history.forEach(function (item) {
            renderMessage(item.role, item.content);
        });
        chatbotState.welcomeShown = true;
    }

    function pruneHistory() {
        if (chatbotState.history.length > MAX_HISTORY_ITEMS) {
            chatbotState.history = chatbotState.history.slice(-MAX_HISTORY_ITEMS);
        }
    }

    // ----------------------------------------------------------------
    // Auto-resize textarea
    // ----------------------------------------------------------------
    function autoResize(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }

    // ----------------------------------------------------------------
    // Scroll messages to bottom
    // ----------------------------------------------------------------
    function scrollToBottom() {
        requestAnimationFrame(function () {
            el.messages.scrollTop = el.messages.scrollHeight;
        });
    }

    // ----------------------------------------------------------------
    // Bind events
    // ----------------------------------------------------------------
    function bindEvents() {
        // Launcher
        el.launcher.addEventListener("click", function () {
            chatbotState.isOpen ? closeChat() : openChat();
        });

        // Close button
        el.clearBtn.addEventListener("click", function () {
            if (confirm("Clear chat history?")) clearChat();
        });

        // Close button
        document.getElementById("sgCloseBtn").addEventListener("click", closeChat);

        // Send button
        el.sendBtn.addEventListener("click", function () { sendMessage(); });

        // Enter to send, Shift+Enter for newline
        el.input.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        el.input.addEventListener("input", function () { autoResize(el.input); });

        // Escape to close
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && chatbotState.isOpen) closeChat();
        });

        // Close when clicking outside on mobile
        el.window.addEventListener("click", function (e) { e.stopPropagation(); });
        document.addEventListener("click", function (e) {
            if (chatbotState.isOpen && !el.launcher.contains(e.target) && !el.window.contains(e.target)) {
                // Only close on mobile/small screens when tapping outside
                if (window.innerWidth < 480) closeChat();
            }
        });
    }

    // ----------------------------------------------------------------
    // Init
    // ----------------------------------------------------------------
    function init() {
        injectHTML();
        bindEvents();

        // Restore history if exists
        var hadHistory = loadHistory();
        if (hadHistory) {
            restoreHistoryUI();
        }
    }

    // Boot after DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
