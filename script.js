/* ==========================================================
   SHILPGRAM — shared interactions
   ========================================================== */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------------- Data (from the ShilpGram deck) ---------------- */
    var MODULES = [
        { id: "identity", icon: "🪪", name: "Digital Business Account", desc: "A verified digital identity for every artisan — the foundation that lets them open credit, sign contracts, and be discovered by buyers as a real business, not an informal producer." },
        { id: "branding", icon: "🎨", name: "Branding & Packaging", desc: "Professional brand identity, packaging design and product photography that let artisans present their craft with the same polish as any established label." },
        { id: "marketplace", icon: "🛒", name: "Marketplace", desc: "Direct B2B and B2C market access — connecting artisans straight to hotels, interior designers, retail chains, export houses and everyday buyers, with no middlemen in between." },
        { id: "finance", icon: "🏦", name: "Finance & Insurance", desc: "Working-capital credit and insurance products designed around an artisan's real income cycle, unlocking growth capital that was previously out of reach." },
        { id: "export", icon: "🚢", name: "Export Support", desc: "End-to-end export documentation, compliance and logistics support so artisan businesses can sell into international markets with confidence." },
        { id: "academy", icon: "🎓", name: "Training Academy", desc: "Structured business learning and mentorship — pricing, digital literacy, operations and growth skills — built specifically for artisan entrepreneurs." },
        { id: "aidesign", icon: "✨", name: "AI Design Studio", desc: "AI-assisted design tools that help artisans create new product variations, patterns and collections while staying true to their craft traditions." },
        { id: "schemes", icon: "🏛️", name: "Government Scheme Hub", desc: "One window to discover, apply for and track the government schemes an artisan is eligible for — PM Vishwakarma, PMEGP, MUDRA, ODOP, SFURTI and more." }
    ];

    var JOURNEY = [
        { step: "Register", title: "Register", desc: "An artisan joins ShilpGram and creates a verified profile — the first step from informal producer to registered business owner." },
        { step: "Digital Identity", title: "Digital Identity", desc: "A Digital Business Account is issued, giving the artisan a credible identity to trade, borrow and be discovered with." },
        { step: "Learn", title: "Learn", desc: "The Training Academy delivers business mentorship and digital literacy built around the realities of running a craft business." },
        { step: "Brand", title: "Brand", desc: "Branding & Packaging and the AI Design Studio turn raw craftsmanship into a market-ready, recognisable product line." },
        { step: "Sell", title: "Sell", desc: "The Marketplace opens direct B2B and B2C demand — hotels, retailers, exporters and consumers — with no middlemen." },
        { step: "Finance", title: "Finance", desc: "Finance & Insurance products supply the working capital needed to fulfil larger orders and manage risk." },
        { step: "Export", title: "Export", desc: "Export Support handles documentation, compliance and logistics so the business can sell into global markets." },
        { step: "Scale", title: "Scale", desc: "With identity, capital, brand and market access in place, the artisan business grows into a sustainable, scalable enterprise." }
    ];

    var SOLUTIONS = [
        { id: "identity", icon: "🪪", name: "Digital Business Identity", desc: "Every artisan gets a verified digital business identity — the credential that unlocks every other service in the ecosystem, from credit to export documentation.", benefits: ["Verified profile recognised across the ecosystem", "Foundation for credit, contracts and scheme applications", "Replaces informal, undocumented trading status"] },
        { id: "schemes", icon: "🏛️", name: "Government Scheme Hub", desc: "A single window that matches artisans to the schemes they qualify for, then guides them through documentation, application and renewal.", benefits: ["Covers PM Vishwakarma, PMEGP, MUDRA, ODOP, SFURTI, NHDP & NLDP", "Guided eligibility check and document preparation", "Application tracking through to renewal"] },
        { id: "branding", icon: "🎨", name: "Branding & Packaging", desc: "Professional identity, packaging and photography so artisan products compete on shelf and online with established brands.", benefits: ["Brand identity built around each artisan's craft story", "Packaging design suited to retail and export", "Consistent visual presentation across channels"] },
        { id: "marketplace", icon: "🛒", name: "Marketplace", desc: "Direct B2B and B2C access that puts artisans in front of real demand instead of relying on middlemen.", benefits: ["B2B access to hotels, designers, retail chains and exporters", "B2C access to direct consumer demand", "Government procurement and corporate gifting channels"] },
        { id: "finance", icon: "🏦", name: "Finance & Insurance", desc: "Credit and insurance products shaped around an artisan's cash-flow cycle, not a generic small-business template.", benefits: ["Working-capital credit for larger orders", "Insurance products suited to craft-based income", "Reduces dependence on informal lenders"] },
        { id: "academy", icon: "🎓", name: "Training Academy", desc: "Structured business learning and one-to-one mentorship that builds the entrepreneurial skills craftsmanship alone doesn't teach.", benefits: ["Business fundamentals and digital literacy", "Ongoing mentorship from experienced entrepreneurs", "Curriculum built specifically for artisan businesses"] },
        { id: "aidesign", icon: "✨", name: "AI Design Studio", desc: "AI-assisted tools that help artisans extend their craft into new patterns, colourways and product lines.", benefits: ["Faster iteration on new product variations", "Keeps traditional craft techniques at the centre", "Lowers the cost of design experimentation"] },
        { id: "export", icon: "🚢", name: "Export Support", desc: "The compliance, documentation and logistics layer that turns a local artisan business into an exporter.", benefits: ["End-to-end export documentation support", "Logistics coordination for international shipping", "Compliance guidance for global buyers"] }
    ];

    var FUNDING = [
        { label: "AI Platform & Product Development", value: 30, color: "#B5502F" },
        { label: "Engineering & Technology Team", value: 18, color: "#C6912B" },
        { label: "Acquisition & Onboarding", value: 14, color: "#16233F" },
        { label: "Sales & Marketing", value: 10, color: "#4B6B4A" },
        { label: "Cloud Infrastructure & Cybersecurity", value: 8, color: "#8C3C22" },
        { label: "Strategic Partnerships & Ecosystem Development", value: 7, color: "#D9AE52" },
        { label: "AI Research & Data Infrastructure", value: 5, color: "#5C5346" },
        { label: "Legal & Compliance", value: 4, color: "#7A9B78" },
        { label: "Working Capital & Contingency", value: 4, color: "#8B7FA8" }
    ];

    var REVENUE = [
        { year: "Year 1", value: 1.2 },
        { year: "Year 2", value: 4.75 },
        { year: "Year 3", value: 16 },
        { year: "Year 4", value: 47 },
        { year: "Year 5", value: 116 }
    ];

    var STREAMS = [
        { name: "Platform Subscription", y1: 0.06, y5: 6, unit: "M" },
        { name: "Marketplace Commission", y1: 0.4, y5: 32, unit: "M" },
        { name: "Branding & Business Services", y1: 0.2, y5: 14, unit: "M" },
        { name: "AI Design Studio", y1: 0.1, y5: 9, unit: "M" },
        { name: "Financial Services", y1: 0.2, y5: 20, unit: "M" },
        { name: "Export & Logistics Services", y1: 0.15, y5: 18, unit: "M" },
        { name: "Government & Enterprise Solutions", y1: 0.1, y5: 17, unit: "M" }
    ];

    var GROWTH = [
        { name: "Platform Subscribers", y1: 120, y5: 10000 },
        { name: "Active Artisans", y1: 40000, y5: 7000000 },
        { name: "Marketplace Sellers", y1: 100, y5: 15000 },
        { name: "AI Design Studio Users", y1: 20, y5: 2000 },
        { name: "Financial Service Users", y1: 8000, y5: 2500000 },
        { name: "Logistics Partners", y1: 250, y5: 20000 },
        { name: "Government & Enterprise Clients", y1: 8, y5: 250 }
    ];

    var ROADMAP = [
        { phase: "Phase 1", title: "Foundation", items: ["Artisan Digital Registration", "Marketplace Launch", "Learning Academy", "Initial State Partnerships"] },
        { phase: "Phase 2", title: "Integration", items: ["Government Scheme Hub", "Business Growth Services", "Branding & Design Support", "Expanded State Partnerships"] },
        { phase: "Phase 3", title: "Expansion", items: ["Export Ecosystem", "Corporate Procurement", "International Buyers", "Financial Services Integration"] },
        { phase: "Phase 4", title: "National Infrastructure", items: ["Pan-India Artisan Network", "Technology Innovation Hub", "Global Market Integration", "Sustainable Scale"] }
    ];

    function fmtNum(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
        if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
        return String(n);
    }

    /* ---------------- Navbar ---------------- */
    function initNavbar() {
        var nav = document.querySelector(".navbar");
        if (!nav) return;
        function onScroll() {
            if (window.scrollY > 40) nav.classList.add("is-scrolled");
            else nav.classList.remove("is-scrolled");
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        var burger = document.querySelector(".hamburger");
        var menu = document.querySelector(".mobile-menu");
        if (burger && menu) {
            burger.addEventListener("click", function () {
                var open = menu.classList.toggle("open");
                burger.classList.toggle("open", open);
                burger.setAttribute("aria-expanded", open ? "true" : "false");
                document.body.style.overflow = open ? "hidden" : "";
            });
            menu.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", function () {
                    menu.classList.remove("open");
                    burger.classList.remove("open");
                    document.body.style.overflow = "";
                });
            });
        }
    }

    /* ---------------- Action + contact dialogs ---------------- */
    function initDialogs() {
        var modal = document.getElementById("sgModal");
        var contact = document.getElementById("contactModal");
        var action = document.getElementById("sgModalAction");
        var title = document.getElementById("sgModalTitle");
        var text = document.getElementById("sgModalText");
        var lastTrigger = null;
        var GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeJa92gdINQcT2rEuV-wA7fbIERE0CSUfP_N_U7TEH6GlvYfg/viewform?usp=publish-editor";

        function closeAll() {
            [modal, contact].forEach(function (m) {
                if (m) { m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true"); }
            });
            document.body.classList.remove("modal-open");
            if (lastTrigger) { try { lastTrigger.focus(); } catch (e) {} }
        }
        function openJoin(type, trigger) {
            if (!modal) return;
            lastTrigger = trigger || null;
            var config = {
                artisan: { icon: "✦", title: "Join as an Artisan", text: "Continue to the ShilpGram Google Form to tell us about your craft and the support you need." },
                buyer: { icon: "◈", title: "Join as a Buyer", text: "Continue to the ShilpGram Google Form to tell us what you are looking to source or procure." },
                join: { icon: "✦", title: "Join the ShilpGram Ecosystem", text: "Continue to the ShilpGram Google Form to share your details and take the next step." }
            }[type] || { icon: "✦", title: "Join the ShilpGram Ecosystem", text: "Continue to the ShilpGram Google Form to share your details and take the next step." };
            var icon = document.getElementById("sgModalIcon");
            if (icon) icon.textContent = config.icon;
            if (title) title.textContent = config.title;
            if (text) text.textContent = config.text;
            if (action) action.href = GOOGLE_FORM_URL;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            var close = modal.querySelector(".sg-modal-close");
            if (close) setTimeout(function () { close.focus(); }, 30);
        }
        function openContact(trigger) {
            if (!contact) return;
            lastTrigger = trigger || null;
            contact.classList.add("is-open");
            contact.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            var close = contact.querySelector(".sg-modal-close");
            if (close) setTimeout(function () { close.focus(); }, 30);
        }
        document.querySelectorAll(".js-join").forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); openJoin("join", el); }); });
        document.querySelectorAll(".js-artisan").forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); openJoin("artisan", el); }); });
        document.querySelectorAll(".js-buyer").forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); openJoin("buyer", el); }); });
        document.querySelectorAll(".js-contact").forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); openContact(el); }); });
        document.querySelectorAll("[data-modal-close]").forEach(function (el) { el.addEventListener("click", closeAll); });
        if (contact) contact.querySelectorAll(".js-join").forEach(function (el) { el.addEventListener("click", function (e) { e.preventDefault(); closeAll(); openJoin("join", el); }); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
    }

    /* ---------------- Scroll reveal ---------------- */
    function initReveal() {
        var items = document.querySelectorAll(".reveal, .reveal-stagger");
        if (!items.length) return;
        if (reduceMotion || !("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("in"); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
        items.forEach(function (el) { io.observe(el); });
    }

    /* ---------------- Counters ---------------- */
    function initCounters() {
        var counters = document.querySelectorAll("[data-counter]");
        if (!counters.length) return;
        function run(el) {
            var target = parseFloat(el.getAttribute("data-counter"));
            var suffix = el.getAttribute("data-suffix") || "";
            var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
            if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
            var dur = 1400, start = null;
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = (target * eased).toFixed(decimals) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }
        if (!("IntersectionObserver" in window)) { counters.forEach(run); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (el) { io.observe(el); });
    }

    /* ---------------- Ecosystem radial diagram ---------------- */
    function buildEcoDiagram(container) {
        if (!container) return;
        var diagram = container.querySelector(".eco-diagram");
        var detail = container.querySelector(".eco-detail");
        var mobileList = container.querySelector(".eco-list-mobile");
        if (!diagram) return;

        var nodesLayer = document.createElement("div");
        var linesLayer = document.createElement("div");
        linesLayer.style.position = "absolute";
        linesLayer.style.inset = "0";
        diagram.appendChild(linesLayer);
        diagram.appendChild(nodesLayer);

        var size = 100; // percent-based positioning
        var radius = 41;
        var cx = 50, cy = 50;

        MODULES.forEach(function (m, i) {
            var angle = (Math.PI * 2 * i) / MODULES.length - Math.PI / 2;
            var x = cx + radius * Math.cos(angle);
            var y = cy + radius * Math.sin(angle);

            var line = document.createElement("div");
            line.className = "eco-line";
            var dx = (x - cx), dy = (y - cy);
            var len = Math.sqrt(dx * dx + dy * dy);
            line.style.width = len + "%";
            line.style.left = cx + "%";
            line.style.top = cy + "%";
            var angDeg = Math.atan2(dy, dx) * (180 / Math.PI);
            line.style.transform = "rotate(" + angDeg + "deg)";
            linesLayer.appendChild(line);

            var node = document.createElement("button");
            node.type = "button";
            node.className = "eco-node";
            node.style.left = x + "%";
            node.style.top = y + "%";
            node.setAttribute("aria-label", m.name);
            node.innerHTML = '<span class="eco-icon">' + m.icon + '</span><b>' + m.name + '</b>';
            node.addEventListener("click", function () { selectModule(m.id, node); });
            nodesLayer.appendChild(node);
        });

        function selectModule(id, activeEl) {
            var m = MODULES.filter(function (x) { return x.id === id; })[0];
            if (!m || !detail) return;
            diagram.querySelectorAll(".eco-node").forEach(function (n) { n.classList.remove("active"); });
            if (activeEl) activeEl.classList.add("active");
            if (mobileList) {
                mobileList.querySelectorAll("button").forEach(function (b) {
                    b.classList.toggle("active", b.getAttribute("data-mod") === id);
                });
            }
            detail.innerHTML = "<h4>" + m.icon + "&nbsp; " + m.name + "</h4><p>" + m.desc + "</p>";
        }

        if (mobileList) {
            MODULES.forEach(function (m) {
                var btn = document.createElement("button");
                btn.type = "button";
                btn.setAttribute("data-mod", m.id);
                btn.innerHTML = "<span>" + m.icon + "</span> " + m.name;
                btn.addEventListener("click", function () { selectModule(m.id, null); });
                mobileList.appendChild(btn);
            });
        }

        selectModule(MODULES[0].id, nodesLayer.querySelector(".eco-node"));
    }

    /* ---------------- Ecosystem module accordion (ecosystem.html) ---------------- */
    function buildAccordion(container) {
        if (!container) return;
        MODULES.forEach(function (m, i) {
            var item = document.createElement("div");
            item.className = "accordion-item";
            item.innerHTML =
                '<button class="accordion-head" aria-expanded="false">' +
                '<div class="acc-meta"><span style="font-size:22px">' + m.icon + '</span><h3>' + m.name + '</h3></div>' +
                '<span class="acc-plus" aria-hidden="true"></span>' +
                '</button>' +
                '<div class="accordion-body"><div class="accordion-body-inner"><p>' + m.desc + '</p></div></div>';
            container.appendChild(item);
            var head = item.querySelector(".accordion-head");
            var body = item.querySelector(".accordion-body");
            head.addEventListener("click", function () {
                var open = item.classList.toggle("open");
                head.setAttribute("aria-expanded", open ? "true" : "false");
                body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
            });
        });
    }

    /* ---------------- Journey stepper (ecosystem.html) ---------------- */
    function buildJourney(container) {
        if (!container) return;
        var stepsWrap = container.querySelector(".journey");
        var detail = container.querySelector(".journey-detail");
        if (!stepsWrap) return;
        JOURNEY.forEach(function (j, i) {
            var el = document.createElement("div");
            el.className = "journey-step" + (i === 0 ? " active" : "");
            el.innerHTML = '<div class="journey-num">' + (i + 1) + '</div><h4>' + j.title + '</h4>';
            el.addEventListener("click", function () {
                stepsWrap.querySelectorAll(".journey-step").forEach(function (s) { s.classList.remove("active"); });
                el.classList.add("active");
                if (detail) detail.innerHTML = '<h3>' + (i + 1) + '. ' + j.title + '</h3><p>' + j.desc + '</p>';
            });
            stepsWrap.appendChild(el);
        });
        if (detail) detail.innerHTML = '<h3>1. ' + JOURNEY[0].title + '</h3><p>' + JOURNEY[0].desc + '</p>';
    }

    /* ---------------- Solutions page: build sections + scrollspy ---------------- */
    function buildSolutions() {
        var main = document.querySelector("[data-solutions-main]");
        var nav = document.querySelector("[data-solutions-nav]");
        if (!main || !nav) return;
        SOLUTIONS.forEach(function (s) {
            var link = document.createElement("a");
            link.href = "#" + s.id;
            link.textContent = s.name;
            nav.appendChild(link);

            var block = document.createElement("div");
            block.className = "solution-block reveal";
            block.id = s.id;
            block.innerHTML =
                '<div class="sol-head"><div class="sol-icon">' + s.icon + '</div><h2>' + s.name + '</h2></div>' +
                '<div class="sol-body">' +
                '<div><p style="font-size:16px;line-height:1.7;color:#5C5346">' + s.desc + '</p>' +
                '<ul class="sol-benefits">' + s.benefits.map(function (b) { return "<li>" + b + "</li>"; }).join("") + '</ul></div>' +
                '<div class="sol-demo" aria-hidden="true">' + solutionDemo(s.id) + '</div>' +
                '</div>';
            main.appendChild(block);
        });

        var links = nav.querySelectorAll("a");
        var sections = SOLUTIONS.map(function (s) { return document.getElementById(s.id); });
        function onScroll() {
            var pos = window.scrollY + 160;
            var current = sections[0];
            sections.forEach(function (sec) { if (sec && sec.offsetTop <= pos) current = sec; });
            links.forEach(function (l) {
                l.classList.toggle("active", current && l.getAttribute("href") === "#" + current.id);
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        initReveal();
    }

    function solutionDemo(id) {
        switch (id) {
            case "identity":
                return '<div style="font-family:var(--font-mono);font-size:12.5px;color:#7A7062">DIGITAL BUSINESS ACCOUNT</div>' +
                    '<div style="margin-top:14px;padding:16px;background:var(--cream);border-radius:10px;display:flex;justify-content:space-between;align-items:center">' +
                    '<div><b style="display:block;font-size:14px">Meera Devi Handicrafts</b><span style="font-size:12px;color:#7A7062">ID · SG-10482 · Verified ✓</span></div><span style="font-size:22px">🪪</span></div>';
            case "schemes":
                return ["PM Vishwakarma", "PMEGP", "MUDRA", "ODOP", "SFURTI", "NHDP & NLDP"].map(function (s) {
                    return '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line-soft);font-size:13.5px"><span>' + s + '</span><span style="color:var(--green);font-weight:600">Eligible</span></div>';
                }).join("");
            case "branding":
                return '<div style="display:flex;gap:12px">' +
                    ['#B5502F', '#C6912B', '#16233F'].map(function (c) { return '<div style="flex:1;aspect-ratio:1;border-radius:10px;background:' + c + '"></div>'; }).join("") + '</div>' +
                    '<p style="margin-top:12px;font-size:12.5px;color:#7A7062">Auto-generated palette & packaging mockups</p>';
            case "marketplace":
                return '<div style="display:flex;justify-content:space-between;align-items:center;font-size:13px">' +
                    '<span style="font-weight:700">Artisan</span><span>→</span><span style="font-weight:700;color:var(--terracotta-d)">ShilpGram</span><span>→</span><span style="font-weight:700">B2B + B2C</span></div>';
            case "finance":
                return '<div style="font-family:var(--font-mono);font-size:12.5px;color:#7A7062">WORKING CAPITAL LINE</div>' +
                    '<div style="margin-top:10px;height:8px;background:var(--cream);border-radius:6px;overflow:hidden"><div style="width:62%;height:100%;background:var(--grad-terracotta)"></div></div>' +
                    '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:12px;color:#7A7062"><span>Utilised</span><span>62%</span></div>';
            case "academy":
                return ["Business Learning", "Business Mentorship", "Digital Literacy"].map(function (s, i) {
                    return '<div style="display:flex;align-items:center;gap:10px;padding:9px 0"><span style="width:22px;height:22px;border-radius:50%;background:var(--grad-ink);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono)">' + (i + 1) + '</span><span style="font-size:13.5px">' + s + '</span></div>';
                }).join("");
            case "aidesign":
                return '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
                    [1, 2, 3].map(function () { return '<div style="aspect-ratio:1;border-radius:8px;background:linear-gradient(135deg,var(--cream-2),var(--cream))"></div>'; }).join("") +
                    '</div><p style="margin-top:12px;font-size:12.5px;color:#7A7062">AI-generated pattern variations</p>';
            case "export":
                return ["Documentation", "Compliance Check", "Logistics Booking", "Shipped"].map(function (s, i) {
                    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0"><span style="color:var(--green)">✓</span><span style="font-size:13.5px">' + s + '</span></div>';
                }).join("");
            default: return "";
        }
    }

    /* ---------------- Tabs (stakeholders) ---------------- */
    function initTabs() {
        var tabBtns = document.querySelectorAll(".tab-btn");
        if (!tabBtns.length) return;
        tabBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var target = btn.getAttribute("data-tab");
                document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
                document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-panel") === target); });
            });
        });
    }

    /* ---------------- SVG line chart (revenue) ---------------- */
    function buildRevenueChart(el) {
        if (!el) return;
        var w = 640, h = 300, pad = 46;
        var max = Math.max.apply(null, REVENUE.map(function (r) { return r.value; }));
        var points = REVENUE.map(function (r, i) {
            var x = pad + (i * (w - pad * 2)) / (REVENUE.length - 1);
            var y = h - pad - (Math.sqrt(r.value / max)) * (h - pad * 1.6);
            return { x: x, y: y, r: r };
        });
        var pathD = points.map(function (p, i) { return (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1); }).join(" ");
        var areaD = pathD + " L" + points[points.length - 1].x + "," + (h - pad) + " L" + points[0].x + "," + (h - pad) + " Z";

        var gridLines = "";
        for (var g = 0; g <= 3; g++) {
            var gy = pad + (g * (h - pad * 1.6)) / 3;
            gridLines += '<line x1="' + pad + '" y1="' + gy + '" x2="' + (w - pad + 10) + '" y2="' + gy + '" stroke="var(--line-soft)" stroke-width="1"/>';
        }

        var dots = points.map(function (p) {
            return '<circle class="rev-dot" cx="' + p.x + '" cy="' + p.y + '" r="5" fill="var(--terracotta)" stroke="#fff" stroke-width="2" data-label="' + p.r.year + '" data-value="$' + p.r.value + 'M"></circle>';
        }).join("");

        var labels = points.map(function (p) {
            return '<text x="' + p.x + '" y="' + (h - pad + 24) + '" text-anchor="middle" font-family="IBM Plex Mono" font-size="11" fill="#7A7062">' + p.r.year.replace("Year ", "Y") + '</text>';
        }).join("");

        el.innerHTML =
            '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Five year revenue projection line chart" style="width:100%;height:auto;overflow:visible">' +
            gridLines +
            '<path d="' + areaD + '" fill="url(#revGrad)" opacity="0.9"></path>' +
            '<path class="rev-line" d="' + pathD + '" fill="none" stroke="var(--terracotta)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>' +
            dots + labels +
            '<defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#B5502F" stop-opacity="0.28"/><stop offset="100%" stop-color="#B5502F" stop-opacity="0"/>' +
            '</linearGradient></defs>' +
            '</svg><div class="tooltip-bubble" id="revTooltip"></div>';

        var line = el.querySelector(".rev-line");
        if (line && !reduceMotion) {
            var len = line.getTotalLength();
            line.style.strokeDasharray = len;
            line.style.strokeDashoffset = len;
            requestAnimationFrame(function () {
                line.style.transition = "stroke-dashoffset 1.6s var(--ease)";
                line.style.strokeDashoffset = 0;
            });
        }
        var tooltip = el.querySelector("#revTooltip");
        el.style.position = "relative";
        el.querySelectorAll(".rev-dot").forEach(function (dot) {
            dot.addEventListener("mouseenter", function (e) {
                showTooltip(tooltip, el, dot.getAttribute("cx"), dot.getAttribute("cy"), w, dot.getAttribute("data-label") + " — " + dot.getAttribute("data-value"));
            });
            dot.addEventListener("mouseleave", function () { tooltip.classList.remove("show"); });
        });
    }

    function showTooltip(tooltip, container, svgX, svgY, svgW, text) {
        var rect = container.getBoundingClientRect();
        var scale = rect.width / svgW;
        tooltip.textContent = text;
        tooltip.style.left = (svgX * scale) + "px";
        tooltip.style.top = (svgY * scale) + "px";
        tooltip.classList.add("show");
    }

    /* ---------------- Funding donut chart ---------------- */
    function buildFundingChart(el) {
        if (!el) return;
        var total = FUNDING.reduce(function (a, b) { return a + b.value; }, 0);
        var size = 260, radius = 100, stroke = 34, cx = size / 2, cy = size / 2, circumference = 2 * Math.PI * radius;
        var offset = 0;
        var segs = FUNDING.map(function (f) {
            var frac = f.value / total;
            var dash = frac * circumference;
            var seg = '<circle class="donut-seg" cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="' + f.color + '" stroke-width="' + stroke + '" ' +
                'stroke-dasharray="' + dash.toFixed(2) + ' ' + (circumference - dash).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '" ' +
                'transform="rotate(-90 ' + cx + ' ' + cy + ')" data-label="' + f.label + '" data-value="$' + f.value + 'K"></circle>';
            offset += dash;
            return seg;
        }).join("");

        el.innerHTML =
            '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Seed funding allocation chart" style="width:100%;max-width:260px;height:auto;margin:0 auto;display:block">' +
            '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="var(--cream-2)" stroke-width="' + stroke + '"/>' +
            segs +
            '</svg><div class="tooltip-bubble" id="fundTooltip"></div>';

        var legend = document.querySelector("[data-funding-legend]");
        if (legend) {
            legend.innerHTML = FUNDING.map(function (f) {
                return '<div class="legend-item"><span class="legend-swatch" style="background:' + f.color + '"></span>' + f.label + ' — $' + f.value + 'K</div>';
            }).join("");
        }

        var tooltip = el.querySelector("#fundTooltip");
        el.style.position = "relative";
        el.querySelectorAll(".donut-seg").forEach(function (seg) {
            seg.addEventListener("mouseenter", function () {
                var rect = el.getBoundingClientRect();
                tooltip.textContent = seg.getAttribute("data-label") + " — " + seg.getAttribute("data-value");
                tooltip.style.left = "50%";
                tooltip.style.top = "44%";
                tooltip.classList.add("show");
            });
            seg.addEventListener("mouseleave", function () { tooltip.classList.remove("show"); });
        });
    }

    /* ---------------- Revenue streams (Y1 -> Y5 bars) ---------------- */
    function buildStreams(container) {
        if (!container) return;
        container.innerHTML = STREAMS.map(function (s) {
            return '<div class="stream-card"><b>' + s.name + '</b>' +
                '<div class="stream-bar-bg"><div class="stream-bar-fill" data-target="100"></div></div>' +
                '<div class="stream-vals"><span>Y1: $' + s.y1 + 'M</span><span>Y5: $' + s.y5 + 'M</span></div></div>';
        }).join("");
        animateOnView(container.querySelectorAll(".stream-bar-fill"), function (el) { el.style.width = "100%"; });
    }

    /* ---------------- User growth bars ---------------- */
    function buildGrowth(container) {
        if (!container) return;
        container.innerHTML = GROWTH.map(function (g) {
            return '<div class="growth-card"><b>' + g.name + '</b>' +
                '<div class="growth-bars">' +
                '<div class="growth-bar-col"><div class="growth-bar" data-h="30"><span>' + fmtNum(g.y1) + '</span></div><div class="growth-bar-label">Year 1</div></div>' +
                '<div class="growth-bar-col"><div class="growth-bar y5" data-h="100"><span>' + fmtNum(g.y5) + '</span></div><div class="growth-bar-label">Year 5</div></div>' +
                '</div></div>';
        }).join("");
        animateOnView(container.querySelectorAll(".growth-bar"), function (el) { el.style.height = el.getAttribute("data-h") + "%"; });
    }

    function animateOnView(els, apply) {
        if (!els.length) return;
        if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(apply); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { apply(entry.target); io.unobserve(entry.target); }
            });
        }, { threshold: 0.3 });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------------- Roadmap ---------------- */
    function buildRoadmap(container) {
        if (!container) return;
        container.innerHTML = ROADMAP.map(function (r, i) {
            return '<div class="phase-card reveal"><div class="phase-dot">' + (i + 1) + '</div><h4>' + r.phase + '</h4><h3>' + r.title + '</h3>' +
                '<ul>' + r.items.map(function (it) { return '<li>' + it + '</li>'; }).join("") + '</ul></div>';
        }).join("");
    }

    /* ---------------- Init ---------------- */
    document.addEventListener("DOMContentLoaded", function () {
        initNavbar();
        initDialogs();
        initTabs();

        var idxEco = document.querySelector("[data-eco-diagram]");
        if (idxEco) buildEcoDiagram(idxEco);

        var accWrap = document.querySelector("[data-accordion]");
        if (accWrap) buildAccordion(accWrap);

        var journeyWrap = document.querySelector("[data-journey]");
        if (journeyWrap) buildJourney(journeyWrap);

        if (document.querySelector("[data-solutions-main]")) buildSolutions();

        var fundingEl = document.querySelector("[data-funding-chart]");
        if (fundingEl) buildFundingChart(fundingEl);
        var revenueEl = document.querySelector("[data-revenue-chart]");
        if (revenueEl) buildRevenueChart(revenueEl);
        var streamsEl = document.querySelector("[data-streams]");
        if (streamsEl) buildStreams(streamsEl);
        var growthEl = document.querySelector("[data-growth]");
        if (growthEl) buildGrowth(growthEl);
        var roadmapEl = document.querySelector("[data-roadmap]");
        if (roadmapEl) buildRoadmap(roadmapEl);

        initReveal();
        initCounters();
    });
})();