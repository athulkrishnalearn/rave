// ============================================================
// RAVE WORKS — Figma Auto-Generator Script
// Paste this into: Plugins → Development → Open Console
// ============================================================

async function buildRAVEWorks() {

    // ── Design Tokens ──────────────────────────────────────────
    const BLACK = { r: 0.04, g: 0.04, b: 0.04 };
    const WHITE = { r: 1, g: 1, b: 1 };
    const GRAY100 = { r: 0.96, g: 0.96, b: 0.96 };
    const GRAY400 = { r: 0.64, g: 0.64, b: 0.64 };
    const GRAY700 = { r: 0.25, g: 0.25, b: 0.25 };
    const GREEN = { r: 0.13, g: 0.77, b: 0.37 };
    const YELLOW = { r: 0.98, g: 0.75, b: 0.02 };
    const RED = { r: 0.93, g: 0.26, b: 0.21 };

    const W = 390;   // mobile frame width
    const GAP = 80;  // gap between frames
    const BORDER = 2;

    // ── Helpers ────────────────────────────────────────────────
    function frame(name, w, h, x, y, bg = WHITE) {
        const f = figma.createFrame();
        f.name = name;
        f.resize(w, h);
        f.x = x; f.y = y;
        f.fills = [{ type: 'SOLID', color: bg }];
        f.strokes = [{ type: 'SOLID', color: BLACK }];
        f.strokeWeight = BORDER;
        f.cornerRadius = 0;
        figma.currentPage.appendChild(f);
        return f;
    }

    function rect(parent, w, h, x, y, color = GRAY100, radius = 0) {
        const r = figma.createRectangle();
        r.resize(w, h);
        r.x = x; r.y = y;
        r.fills = [{ type: 'SOLID', color }];
        r.cornerRadius = radius;
        if (color === BLACK) {
            r.strokes = [];
        } else {
            r.strokes = [{ type: 'SOLID', color: BLACK }];
            r.strokeWeight = BORDER;
        }
        parent.appendChild(r);
        return r;
    }

    async function txt(parent, content, size, weight, color = BLACK, x = 0, y = 0, w = 340) {
        const t = figma.createText();
        await figma.loadFontAsync({ family: 'Inter', style: weight >= 700 ? 'Bold' : weight >= 500 ? 'Medium' : 'Regular' });
        t.fontName = { family: 'Inter', style: weight >= 700 ? 'Bold' : weight >= 500 ? 'Medium' : 'Regular' };
        t.characters = content;
        t.fontSize = size;
        t.fills = [{ type: 'SOLID', color }];
        t.x = x; t.y = y;
        try { t.resize(w, t.height); } catch (e) { }
        parent.appendChild(t);
        return t;
    }

    function inputField(parent, label, placeholder, y, w = 338) {
        const box = figma.createFrame();
        box.name = label;
        box.resize(w, 52);
        box.x = 24; box.y = y;
        box.fills = [{ type: 'SOLID', color: WHITE }];
        box.strokes = [{ type: 'SOLID', color: BLACK }];
        box.strokeWeight = BORDER;
        box.cornerRadius = 8;
        // shadow
        box.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 }, offset: { x: 4, y: 4 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }];
        parent.appendChild(box);
        return box;
    }

    function tactileBtn(parent, label, y, x = 24, w = 338, bgColor = BLACK, txtColor = WHITE) {
        const btn = figma.createFrame();
        btn.name = `BTN_${label}`;
        btn.resize(w, 52);
        btn.x = x; btn.y = y;
        btn.fills = [{ type: 'SOLID', color: bgColor }];
        btn.strokes = [{ type: 'SOLID', color: BLACK }];
        btn.strokeWeight = BORDER;
        btn.cornerRadius = 8;
        btn.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 }, offset: { x: 6, y: 6 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }];
        parent.appendChild(btn);
        return btn;
    }

    function chip(parent, label, x, y, filled = false) {
        const c = figma.createFrame();
        c.name = `CHIP_${label}`;
        c.resize(80, 32);
        c.x = x; c.y = y;
        c.fills = [{ type: 'SOLID', color: filled ? BLACK : WHITE }];
        c.strokes = [{ type: 'SOLID', color: BLACK }];
        c.strokeWeight = BORDER;
        c.cornerRadius = 999;
        parent.appendChild(c);
        return c;
    }

    function navDock(parent, y = 750) {
        const dock = figma.createFrame();
        dock.name = 'NAV_DOCK';
        dock.resize(W - 32, 64);
        dock.x = 16; dock.y = y;
        dock.fills = [{ type: 'SOLID', color: BLACK }];
        dock.strokes = [{ type: 'SOLID', color: BLACK }];
        dock.strokeWeight = BORDER;
        dock.cornerRadius = 999;
        dock.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 }, offset: { x: 4, y: 4 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }];
        parent.appendChild(dock);
        // 5 icon placeholders
        const icons = ['⌂', '⊕', '+', '✉', '◉'];
        const spacing = (W - 32) / 5;
        icons.forEach((ic, i) => {
            const dot = figma.createEllipse();
            dot.resize(32, 32);
            dot.x = i * spacing + (spacing - 32) / 2;
            dot.y = 16;
            dot.fills = [{ type: 'SOLID', color: i === 0 ? WHITE : GRAY700 }];
            dock.appendChild(dot);
        });
        return dock;
    }

    function statusBar(parent) {
        const bar = figma.createFrame();
        bar.name = 'STATUS_BAR';
        bar.resize(W, 44);
        bar.x = 0; bar.y = 0;
        bar.fills = [{ type: 'SOLID', color: WHITE }];
        parent.appendChild(bar);
        return bar;
    }

    function sectionDivider(parent, y) {
        const line = figma.createLine();
        line.x = 0; line.y = y;
        line.resize(W, 0);
        line.strokes = [{ type: 'SOLID', color: GRAY100 }];
        line.strokeWeight = 1;
        parent.appendChild(line);
    }

    function card(parent, w, h, x, y, bg = WHITE) {
        const c = figma.createFrame();
        c.name = 'CARD';
        c.resize(w, h);
        c.x = x; c.y = y;
        c.fills = [{ type: 'SOLID', color: bg }];
        c.strokes = [{ type: 'SOLID', color: BLACK }];
        c.strokeWeight = BORDER;
        c.cornerRadius = 12;
        c.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 }, offset: { x: 6, y: 6 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }];
        parent.appendChild(c);
        return c;
    }

    // ── Screens ────────────────────────────────────────────────
    let xOffset = 0;

    // ── 01 LOGIN ───────────────────────────────────────────────
    {
        const f = frame('01 — Login', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        // Logo circle
        const logo = figma.createEllipse();
        logo.resize(64, 64); logo.x = (W - 64) / 2; logo.y = 100;
        logo.fills = [{ type: 'SOLID', color: BLACK }];
        f.appendChild(logo);
        await txt(f, 'ACCESS PORTAL', 28, 900, BLACK, 60, 185, 270);
        await txt(f, 'Enter your credentials to enter the grid.', 13, 400, GRAY700, 36, 222, 318);
        inputField(f, 'Email', 'user@rave.com', 270);
        inputField(f, 'Password', '••••••••', 338);
        const btn = tactileBtn(f, 'AUTHENTICATE', 414);
        await txt(btn, 'AUTHENTICATE', 14, 700, WHITE, 90, 17, 180);
        await txt(f, 'New here? Join the RAVE →', 13, 500, GRAY700, 90, 484, 210);
        navDock(f, 760);
    }

    // ── 02 SIGNUP STEP 1 ───────────────────────────────────────
    {
        const f = frame('02 — Signup: Role Select', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        await txt(f, 'CHOOSE YOUR PATH', 24, 900, BLACK, 24, 80, 342);
        await txt(f, 'Select your role to get started', 13, 400, GRAY700, 24, 116, 342);
        // Role cards
        const rh = card(f, W - 48, 140, 24, 160);
        await txt(rh, '✦  RAVE HEAD', 16, 700, BLACK, 20, 20, 260);
        await txt(rh, 'Creatives · Freelancers · Editors · Musicians', 12, 400, GRAY700, 20, 46, 290);
        const ov = card(f, W - 48, 140, 24, 320);
        ov.fills = [{ type: 'SOLID', color: GRAY100 }];
        await txt(ov, '⬛  OG VENDOR', 16, 700, BLACK, 20, 20, 260);
        await txt(ov, 'Brands · Agencies · Labels', 12, 400, GRAY700, 20, 46, 290);
        const btn = tactileBtn(f, 'CONTINUE', 490);
        await txt(btn, 'CONTINUE', 14, 700, WHITE, 135, 17, 120);
        await txt(f, 'Already have an account? Login', 13, 500, GRAY700, 90, 560, 220);
    }

    // ── 03 SIGNUP STEP 2 ───────────────────────────────────────
    {
        const f = frame('03 — Signup: Registration', W, 960, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        await txt(f, 'YOUR PROFILE', 22, 900, BLACK, 24, 70, 342);
        await txt(f, 'Step 2 of 2 — Details & Verification', 12, 400, GRAY700, 24, 100, 342);
        inputField(f, 'Full Name', '', 132);
        inputField(f, 'Email', '', 200);
        inputField(f, 'Password', '', 268);
        // ID Upload box
        const upload = figma.createFrame();
        upload.name = 'ID_UPLOAD'; upload.resize(338, 80);
        upload.x = 24; upload.y = 352;
        upload.fills = [{ type: 'SOLID', color: GRAY100 }];
        upload.strokes = [{ type: 'SOLID', color: BLACK }];
        upload.strokeWeight = BORDER; upload.cornerRadius = 8;
        upload.dashPattern = [8, 4];
        f.appendChild(upload);
        await txt(f, '⬆  Upload Government ID', 13, 500, GRAY700, 80, 370, 200);
        // Interests grid
        await txt(f, 'INTERESTS', 11, 700, GRAY700, 24, 448, 342);
        ['Creator', 'Freelancer', 'Editor', 'Musician', 'Model', 'Sales'].forEach((lb, i) => {
            chip(f, lb, 24 + (i % 3) * 116, 468 + Math.floor(i / 3) * 44, i === 0);
        });
        // Skills
        await txt(f, 'SKILLS  — press Enter to add', 11, 700, GRAY700, 24, 570, 342);
        inputField(f, 'Skills', '', 590);
        const btn = tactileBtn(f, 'COMPLETE REGISTRATION', 670);
        await txt(btn, 'COMPLETE REGISTRATION', 13, 700, WHITE, 55, 17, 230);
    }

    // ── 04 FEED ────────────────────────────────────────────────
    {
        const f = frame('04 — Feed (Home)', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        // Header bar
        const hdr = figma.createFrame();
        hdr.name = 'HEADER'; hdr.resize(W, 56); hdr.x = 0; hdr.y = 44;
        hdr.fills = [{ type: 'SOLID', color: WHITE }];
        hdr.strokes = [{ type: 'SOLID', color: BLACK }]; hdr.strokeWeight = BORDER;
        f.appendChild(hdr);
        await txt(hdr, 'RAVE', 20, 900, BLACK, 20, 16, 200);
        const createBtn = tactileBtn(hdr, '+ CREATE', 8, W - 118, 96, BLACK, WHITE);
        await txt(createBtn, '+ CREATE', 12, 700, WHITE, 14, 14, 80);

        // Feed posts
        [
            { type: 'DROP', author: 'cybergoth99', badge: 'RAVE HEAD', y: 116 },
            { type: 'WORK', author: 'loopmaker', badge: 'RAVE HEAD', y: 300 },
            { type: 'CAMPAIGN', author: 'NeonBrand Co.', badge: 'OG VENDOR', y: 500 },
        ].forEach(async (post) => {
            const c = card(f, W - 32, 160, 16, post.y);
            // Avatar
            const av = figma.createEllipse();
            av.resize(36, 36); av.x = 16; av.y = 16;
            av.fills = [{ type: 'SOLID', color: BLACK }];
            c.appendChild(av);
            await txt(c, post.author, 13, 700, BLACK, 62, 18, 160);
            // Badge
            const badge = figma.createFrame();
            badge.name = 'BADGE'; badge.resize(72, 20); badge.x = 62; badge.y = 40;
            badge.fills = [{ type: 'SOLID', color: post.badge === 'OG VENDOR' ? YELLOW : GRAY100 }];
            badge.strokes = [{ type: 'SOLID', color: BLACK }]; badge.strokeWeight = 1;
            badge.cornerRadius = 999;
            c.appendChild(badge);
            await txt(c, post.badge, 9, 700, BLACK, 70, 43, 70);
            // Content area
            rect(c, (W - 32) - 32, 80, 16, 70, GRAY100, 8);
            await txt(c, post.type === 'CAMPAIGN' ? 'Campaign Brief — requirements listed here' : 'Creative post content preview text…', 12, 400, GRAY700, 16, 72, (W - 32) - 48);
            // Metrics
            await txt(c, '❤  24    ◎  6', 11, 400, GRAY400, 16, 140, 200);
        });
        navDock(f, 760);
    }

    // ── 05 EXPLORE ─────────────────────────────────────────────
    {
        const f = frame('05 — Explore', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        // Search bar
        const sbar = figma.createFrame();
        sbar.name = 'SEARCH'; sbar.resize(W - 32, 48); sbar.x = 16; sbar.y = 60;
        sbar.fills = [{ type: 'SOLID', color: WHITE }];
        sbar.strokes = [{ type: 'SOLID', color: BLACK }]; sbar.strokeWeight = BORDER;
        sbar.cornerRadius = 999;
        sbar.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 }, offset: { x: 4, y: 4 }, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }];
        f.appendChild(sbar);
        await txt(sbar, '🔍  Search Campaigns, Talent, or Vibes…', 13, 400, GRAY400, 20, 14, 260);
        // Filter pills
        ['TRENDING', 'CAMPAIGNS', '3D ART', 'VIDEO', 'MUSIC'].forEach((lb, i) => {
            chip(f, lb, 16 + i * 88, 124, i === 0);
        });
        // Featured card (Editor's Pick)
        const feat = card(f, W - 32, 220, 16, 170);
        feat.fills = [{ type: 'SOLID', color: BLACK }];
        const epBadge = figma.createFrame();
        epBadge.name = 'EP_BADGE'; epBadge.resize(108, 24); epBadge.x = 16; epBadge.y = 16;
        epBadge.fills = [{ type: 'SOLID', color: WHITE }];
        epBadge.strokes = [{ type: 'SOLID', color: BLACK }]; epBadge.strokeWeight = BORDER;
        epBadge.cornerRadius = 4;
        feat.appendChild(epBadge);
        await txt(feat, "EDITOR'S PICK", 10, 700, BLACK, 22, 20, 100);
        await txt(feat, 'NEON RUNNER 2049', 20, 900, WHITE, 16, 160, 300);
        await txt(feat, 'Top Rated Creator ↗', 12, 400, GRAY400, 16, 188, 300);
        // Small grid cards
        [0, 1, 2, 3].forEach((i) => {
            const gc = card(f, (W - 48) / 2, 120, 16 + (i % 2) * ((W - 48) / 2 + 16), 410 + Math.floor(i / 2) * 136);
            gc.fills = [{ type: 'SOLID', color: GRAY100 }];
        });
        navDock(f, 760);
    }

    // ── 06 CREATE (two sub-frames side by side) ────────────────
    {
        // CREATE POST
        const f1 = frame('06a — Create Post', W, 844, xOffset, 0);
        await txt(f1, 'CREATE A DROP', 22, 900, BLACK, 24, 60, 342);
        const toggleRow = figma.createFrame();
        toggleRow.name = 'TYPE_TOGGLE'; toggleRow.resize(W - 48, 48); toggleRow.x = 24; toggleRow.y = 100;
        toggleRow.fills = [{ type: 'SOLID', color: GRAY100 }];
        toggleRow.strokes = [{ type: 'SOLID', color: BLACK }]; toggleRow.strokeWeight = BORDER;
        toggleRow.cornerRadius = 8;
        f1.appendChild(toggleRow);
        const activeTab = figma.createFrame();
        activeTab.resize((W - 48) / 2, 44); activeTab.x = 0; activeTab.y = 0;
        activeTab.fills = [{ type: 'SOLID', color: BLACK }]; activeTab.cornerRadius = 6;
        toggleRow.appendChild(activeTab);
        await txt(f1, 'DROP', 13, 700, WHITE, 68, 114, 100);
        await txt(f1, 'WORK', 13, 700, GRAY700, 235, 114, 100);
        inputField(f1, 'Title', '', 166);
        const bodyBox = figma.createFrame();
        bodyBox.name = 'BODY'; bodyBox.resize(338, 120); bodyBox.x = 24; bodyBox.y = 234;
        bodyBox.fills = [{ type: 'SOLID', color: WHITE }];
        bodyBox.strokes = [{ type: 'SOLID', color: BLACK }]; bodyBox.strokeWeight = BORDER; bodyBox.cornerRadius = 8;
        f1.appendChild(bodyBox);
        rect(f1, 338, 80, 24, 372, GRAY100, 8);
        await txt(f1, '⬆  Upload Media (Image / Video)', 12, 500, GRAY700, 60, 400, 220);
        const btn1 = tactileBtn(f1, 'POST TO THE GRID', 480);
        await txt(btn1, 'POST TO THE GRID', 14, 700, WHITE, 80, 17, 200);
        navDock(f1, 760);

        xOffset += W + GAP;

        // CREATE CAMPAIGN
        const f2 = frame('06b — Create Campaign', W, 960, xOffset, 0);
        xOffset += W + GAP;
        await txt(f2, 'LAUNCH CAMPAIGN', 22, 900, BLACK, 24, 60, 342);
        await txt(f2, 'OG Vendors only — verified accounts', 12, 400, GRAY700, 24, 92, 342);
        inputField(f2, 'Campaign Title', '', 130);
        // Type selector
        ['CREATOR', 'SALES', 'FREELANCE'].forEach((lb, i) => {
            const t = figma.createFrame();
            t.name = `TYPE_${lb}`; t.resize(100, 40); t.x = 24 + i * 110; t.y = 200;
            t.fills = [{ type: 'SOLID', color: i === 0 ? BLACK : WHITE }];
            t.strokes = [{ type: 'SOLID', color: BLACK }]; t.strokeWeight = BORDER; t.cornerRadius = 8;
            f2.appendChild(t);
        });
        const descBox = figma.createFrame();
        descBox.name = 'DESC'; descBox.resize(338, 100); descBox.x = 24; descBox.y = 258;
        descBox.fills = [{ type: 'SOLID', color: WHITE }];
        descBox.strokes = [{ type: 'SOLID', color: BLACK }]; descBox.strokeWeight = BORDER; descBox.cornerRadius = 8;
        f2.appendChild(descBox);
        await txt(f2, 'REQUIREMENTS  — add items', 11, 700, GRAY700, 24, 374, 342);
        [0, 1, 2].forEach(i => inputField(f2, `Req${i}`, '', 394 + i * 64, 300));
        inputField(f2, 'Pay Amount', '', 590);
        rect(f2, 338, 70, 24, 660, GRAY100, 8);
        await txt(f2, '⬆  Upload Brand Assets', 12, 500, GRAY700, 60, 688, 220);
        const btn2 = tactileBtn(f2, 'LAUNCH CAMPAIGN', 750);
        await txt(btn2, 'LAUNCH CAMPAIGN', 14, 700, WHITE, 80, 17, 200);
    }

    // ── 07 DASHBOARD (Rave Head) ────────────────────────────────
    {
        const f = frame('07a — Dashboard (Rave Head)', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        const hdr = figma.createFrame();
        hdr.name = 'HEADER'; hdr.resize(W, 56); hdr.x = 0; hdr.y = 44;
        hdr.fills = [{ type: 'SOLID', color: BLACK }];
        f.appendChild(hdr);
        await txt(hdr, 'GIG CENTER', 18, 900, WHITE, 20, 16, 240);
        await txt(f, 'ACTIVE APPLICATIONS', 11, 700, GRAY700, 24, 116, 342);
        [
            { campaign: 'Neon Brand Shoot', status: 'PENDING', statusColor: YELLOW },
            { campaign: 'Summer Festival Promo', status: 'ACCEPTED', statusColor: GREEN },
            { campaign: 'Urban Drops Vol. 3', status: 'REJECTED', statusColor: RED },
        ].forEach(async (app, i) => {
            const c = card(f, W - 32, 72, 16, 140 + i * 88);
            await txt(c, app.campaign, 13, 700, BLACK, 16, 14, 200);
            const badge = figma.createFrame();
            badge.resize(80, 22); badge.x = W - 32 - 96; badge.y = 25;
            badge.fills = [{ type: 'SOLID', color: app.statusColor }];
            badge.strokes = [{ type: 'SOLID', color: BLACK }]; badge.strokeWeight = BORDER;
            badge.cornerRadius = 999;
            c.appendChild(badge);
        });
        await txt(f, 'INBOX PREVIEW', 11, 700, GRAY700, 24, 420, 342);
        [0, 1].forEach(i => {
            const c = card(f, W - 32, 60, 16, 444 + i * 76);
            const av = figma.createEllipse(); av.resize(32, 32); av.x = 12; av.y = 14;
            av.fills = [{ type: 'SOLID', color: GRAY700 }]; c.appendChild(av);
        });
        navDock(f, 760);
    }

    // ── 07b DASHBOARD (OG Vendor) ──────────────────────────────
    {
        const f = frame('07b — Dashboard (OG Vendor)', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        const hdr = figma.createFrame();
        hdr.name = 'HEADER'; hdr.resize(W, 56); hdr.x = 0; hdr.y = 44;
        hdr.fills = [{ type: 'SOLID', color: BLACK }];
        f.appendChild(hdr);
        await txt(hdr, 'CAMPAIGN MANAGER', 18, 900, WHITE, 12, 16, 260);
        await txt(f, 'YOUR CAMPAIGNS', 11, 700, GRAY700, 24, 116, 342);
        [
            { title: 'Summer Festival Promo', status: 'ACTIVE', count: '12 applicants' },
            { title: 'Street Art Series', status: 'CLOSED', count: '5 applicants' },
        ].forEach(async (camp, i) => {
            const c = card(f, W - 32, 90, 16, 140 + i * 106);
            await txt(c, camp.title, 14, 700, BLACK, 16, 16, 220);
            await txt(c, camp.count, 12, 400, GRAY700, 16, 42, 180);
            const sBadge = figma.createFrame();
            sBadge.resize(60, 24); sBadge.x = W - 32 - 76; sBadge.y = 16;
            sBadge.fills = [{ type: 'SOLID', color: camp.status === 'ACTIVE' ? GREEN : GRAY400 }];
            sBadge.strokes = [{ type: 'SOLID', color: BLACK }]; sBadge.strokeWeight = BORDER; sBadge.cornerRadius = 999;
            c.appendChild(sBadge);
            const hireBtn = tactileBtn(c, 'HIRE', 56, W - 32 - 88, 72, BLACK, WHITE);
            hireBtn.resize(72, 28); hireBtn.y = 54;
        });
        await txt(f, 'RECENT APPLICANTS', 11, 700, GRAY700, 24, 368, 342);
        [0, 1, 2].forEach(i => {
            const c = card(f, W - 32, 60, 16, 392 + i * 76);
            const av = figma.createEllipse(); av.resize(32, 32); av.x = 12; av.y = 14;
            av.fills = [{ type: 'SOLID', color: BLACK }]; c.appendChild(av);
            const hBtn = tactileBtn(c, 'HIRE', 18, W - 32 - 100, 80, BLACK, WHITE);
            hBtn.resize(80, 28);
        });
        navDock(f, 760);
    }

    // ── 08 PROJECT WORKSPACE ───────────────────────────────────
    {
        const f = frame('08 — Project Workspace', W, 960, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        const hdr = figma.createFrame();
        hdr.name = 'HEADER'; hdr.resize(W, 56); hdr.x = 0; hdr.y = 44;
        hdr.fills = [{ type: 'SOLID', color: BLACK }];
        f.appendChild(hdr);
        await txt(hdr, 'PROJECT WORKSPACE', 16, 900, WHITE, 12, 16, 250);
        // Status track
        const statuses = ['ACTIVE', 'SUBMITTED', 'REVISION', 'COMPLETED'];
        statuses.forEach(async (s, i) => {
            const dot = figma.createEllipse();
            dot.resize(24, 24); dot.x = 24 + i * 82; dot.y = 116;
            dot.fills = [{ type: 'SOLID', color: i === 0 ? GREEN : GRAY100 }];
            dot.strokes = [{ type: 'SOLID', color: BLACK }]; dot.strokeWeight = BORDER;
            f.appendChild(dot);
        });
        await txt(f, 'BRIEFS & ASSETS', 11, 700, GRAY700, 24, 158, 342);
        rect(f, W - 48, 90, 24, 178, GRAY100, 8);
        await txt(f, '⬆  SUBMIT DELIVERABLE', 11, 700, GRAY700, 24, 284, 342);
        inputField(f, 'Delivery URL', '', 304);
        const subBtn = tactileBtn(f, 'SUBMIT WORK', 372);
        await txt(subBtn, 'SUBMIT WORK', 14, 700, WHITE, 100, 17, 160);
        await txt(f, 'PAYMENT', 11, 700, GRAY700, 24, 444, 342);
        const payCard = card(f, W - 48, 80, 24, 464);
        await txt(payCard, '₹ 5,000', 24, 900, BLACK, 24, 24, 160);
        const payBadge = figma.createFrame();
        payBadge.resize(64, 24); payBadge.x = payCard.width - 80; payBadge.y = 28;
        payBadge.fills = [{ type: 'SOLID', color: YELLOW }];
        payBadge.strokes = [{ type: 'SOLID', color: BLACK }]; payBadge.strokeWeight = BORDER; payBadge.cornerRadius = 999;
        payCard.appendChild(payBadge);
        await txt(f, 'MESSAGES', 11, 700, GRAY700, 24, 564, 342);
        [0, 1].forEach(i => {
            const bubble = figma.createFrame();
            bubble.name = `MSG_${i}`; bubble.resize(200, 40);
            bubble.x = i === 0 ? 24 : W - 224; bubble.y = 584 + i * 56;
            bubble.fills = [{ type: 'SOLID', color: i === 0 ? GRAY100 : BLACK }];
            bubble.strokes = [{ type: 'SOLID', color: BLACK }]; bubble.strokeWeight = BORDER; bubble.cornerRadius = 12;
            f.appendChild(bubble);
        });
        inputField(f, 'Message Input', '', 700);
    }

    // ── 09 PROFILE ─────────────────────────────────────────────
    {
        const f = frame('09 — Profile', W, 960, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        // Cover
        rect(f, W, 180, 0, 0, BLACK, 0);
        // Avatar
        const av = figma.createEllipse();
        av.resize(80, 80); av.x = (W - 80) / 2; av.y = 140;
        av.fills = [{ type: 'SOLID', color: WHITE }];
        av.strokes = [{ type: 'SOLID', color: BLACK }]; av.strokeWeight = BORDER;
        f.appendChild(av);
        await txt(f, 'cybergoth99', 20, 900, BLACK, 100, 234, 200);
        const vBadge = figma.createFrame();
        vBadge.resize(80, 24); vBadge.x = (W - 80) / 2; vBadge.y = 260;
        vBadge.fills = [{ type: 'SOLID', color: GREEN }];
        vBadge.strokes = [{ type: 'SOLID', color: BLACK }]; vBadge.strokeWeight = BORDER; vBadge.cornerRadius = 999;
        f.appendChild(vBadge);
        await txt(f, '✓ VERIFIED', 10, 700, WHITE, (W - 80) / 2 + 8, 263, 80);
        await txt(f, 'Rave Head · Creator · Editor · Musician', 12, 400, GRAY700, 44, 294, 310);
        // Stats row
        ['12 Posts', '4.8 ★', '8 Skills'].forEach(async (s, i) => {
            const sc = figma.createFrame();
            sc.resize(100, 56); sc.x = 16 + i * 122; sc.y = 330;
            sc.fills = [{ type: 'SOLID', color: GRAY100 }];
            sc.strokes = [{ type: 'SOLID', color: BLACK }]; sc.strokeWeight = BORDER; sc.cornerRadius = 8;
            f.appendChild(sc);
            await txt(sc, s, 14, 700, BLACK, 20, 18, 80);
        });
        // Skills chips
        await txt(f, 'SKILLS', 11, 700, GRAY700, 24, 404, 342);
        ['Video Edit', 'Motion', '3D', 'Mixing'].forEach((sk, i) => chip(f, sk, 24 + i * 90, 424, false));
        // Portfolio grid
        await txt(f, 'PORTFOLIO', 11, 700, GRAY700, 24, 476, 342);
        [0, 1, 2, 3].forEach(i => {
            rect(f, (W - 56) / 2, 100, 24 + (i % 2) * ((W - 56) / 2 + 8), 496 + Math.floor(i / 2) * 116, GRAY100, 8);
        });
        // Edit btn
        const editBtn = tactileBtn(f, 'EDIT PROFILE', 730, W - 150, 126, WHITE, BLACK);
        await txt(editBtn, 'EDIT PROFILE', 12, 700, BLACK, 14, 14, 100);
        navDock(f, 880);
    }

    // ── 10 INBOX ───────────────────────────────────────────────
    {
        const f = frame('10 — Inbox', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        const hdr = figma.createFrame();
        hdr.name = 'HEADER'; hdr.resize(W, 56); hdr.x = 0; hdr.y = 44;
        hdr.fills = [{ type: 'SOLID', color: BLACK }]; f.appendChild(hdr);
        await txt(hdr, 'INBOX', 20, 900, WHITE, 24, 16, 200);
        await txt(f, 'CONVERSATIONS', 11, 700, GRAY700, 24, 116, 342);
        [
            { name: 'NeonBrand Co.', preview: 'Can you deliver by Friday?' },
            { name: 'SoundwaveLabel', preview: 'Your reel is approved — payment coming' },
            { name: 'UrbanDrops Inc.', preview: 'We loved your application!' },
        ].forEach(async (conv, i) => {
            const c = card(f, W - 32, 72, 16, 140 + i * 88);
            const av = figma.createEllipse(); av.resize(36, 36); av.x = 12; av.y = 18;
            av.fills = [{ type: 'SOLID', color: BLACK }]; c.appendChild(av);
            await txt(c, conv.name, 13, 700, BLACK, 60, 16, 200);
            await txt(c, conv.preview, 11, 400, GRAY700, 60, 38, 220);
            // Unread badge
            const ub = figma.createEllipse(); ub.resize(20, 20);
            ub.x = W - 32 - 32; ub.y = 26;
            ub.fills = [{ type: 'SOLID', color: GREEN }]; c.appendChild(ub);
        });
        navDock(f, 760);
    }

    // ── 11 ADMIN CONSOLE ───────────────────────────────────────
    {
        const f = frame('11 — Admin Console', W, 960, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        const hdr = figma.createFrame();
        hdr.name = 'HEADER'; hdr.resize(W, 64); hdr.x = 0; hdr.y = 44;
        hdr.fills = [{ type: 'SOLID', color: WHITE }];
        hdr.strokes = [{ type: 'SOLID', color: BLACK }]; hdr.strokeWeight = BORDER;
        f.appendChild(hdr);
        await txt(hdr, '⚠ ADMIN CONSOLE', 18, 900, BLACK, 24, 20, 260);
        // Tabs
        const tabs = ['OVERVIEW', 'USERS', 'CONTENT', 'VERIFY'];
        const tabRow = figma.createFrame();
        tabRow.name = 'TABS'; tabRow.resize(W, 48); tabRow.x = 0; tabRow.y = 108;
        tabRow.fills = [{ type: 'SOLID', color: GRAY100 }];
        tabRow.strokes = [{ type: 'SOLID', color: BLACK }]; tabRow.strokeWeight = BORDER;
        f.appendChild(tabRow);
        tabs.forEach(async (t, i) => {
            const tab = figma.createFrame();
            tab.resize(W / 4, 48); tab.x = i * (W / 4); tab.y = 0;
            tab.fills = [{ type: 'SOLID', color: i === 0 ? BLACK : WHITE }];
            tabRow.appendChild(tab);
            await txt(tab, t, 10, 700, i === 0 ? WHITE : GRAY700, 8, 16, W / 4 - 16);
        });
        // Stats grid
        const statsData = [
            { label: 'TOTAL USERS', val: '4', color: WHITE },
            { label: 'TOTAL DROPS', val: '7', color: WHITE },
            { label: 'CAMPAIGNS', val: '1', color: WHITE },
            { label: 'PENDING', val: '0', color: WHITE },
        ];
        statsData.forEach(async (s, i) => {
            const sc = card(f, (W - 56) / 2, 80, 16 + (i % 2) * ((W - 56) / 2 + 8), 176 + Math.floor(i / 2) * 96);
            await txt(sc, s.label, 9, 700, GRAY700, 12, 12, 120);
            await txt(sc, s.val, 28, 900, i === 2 ? GREEN : i === 3 ? YELLOW : BLACK, 12, 36, 80);
        });
        // Users table header
        await txt(f, 'USER MANAGEMENT', 11, 700, GRAY700, 24, 380, 342);
        const tableHdr = figma.createFrame(); tableHdr.resize(W - 32, 36); tableHdr.x = 16; tableHdr.y = 400;
        tableHdr.fills = [{ type: 'SOLID', color: BLACK }]; f.appendChild(tableHdr);
        await txt(tableHdr, 'USER', 10, 700, WHITE, 12, 10, 80);
        await txt(tableHdr, 'ROLE', 10, 700, WHITE, 130, 10, 70);
        await txt(tableHdr, 'STATUS', 10, 700, WHITE, 210, 10, 70);
        await txt(tableHdr, 'ACTION', 10, 700, WHITE, 300, 10, 60);
        [
            { name: 'Super Admin', role: 'admin', status: 'verified', statusColor: GREEN },
            { name: 'Alice Dancer', role: 'rave_head', status: 'verified', statusColor: GREEN },
            { name: 'Rave Vendor Inc.', role: 'og_vendor', status: 'verified', statusColor: GREEN },
            { name: 'Bob DJ', role: 'rave_head', status: 'rejected', statusColor: RED },
        ].forEach(async (user, i) => {
            const row = figma.createFrame();
            row.resize(W - 32, 48); row.x = 16; row.y = 436 + i * 56;
            row.fills = [{ type: 'SOLID', color: i % 2 === 0 ? WHITE : GRAY100 }];
            row.strokes = [{ type: 'SOLID', color: GRAY400 }]; row.strokeWeight = 1;
            f.appendChild(row);
            await txt(row, user.name, 11, 500, BLACK, 12, 14, 100);
            await txt(row, user.role, 10, 400, GRAY700, 130, 14, 70);
            const sb = figma.createFrame(); sb.resize(60, 22); sb.x = 210; sb.y = 13;
            sb.fills = [{ type: 'SOLID', color: user.statusColor }];
            sb.strokes = [{ type: 'SOLID', color: BLACK }]; sb.strokeWeight = 1; sb.cornerRadius = 999;
            row.appendChild(sb);
            const banBtn = figma.createFrame(); banBtn.resize(36, 28); banBtn.x = 320; banBtn.y = 10;
            banBtn.fills = [{ type: 'SOLID', color: RED }];
            banBtn.strokes = [{ type: 'SOLID', color: BLACK }]; banBtn.strokeWeight = BORDER; banBtn.cornerRadius = 6;
            row.appendChild(banBtn);
        });
    }

    // ── 12 SETTINGS ────────────────────────────────────────────
    {
        const f = frame('12 — Settings', W, 844, xOffset, 0);
        xOffset += W + GAP;
        statusBar(f);
        const hdr = figma.createFrame();
        hdr.name = 'HEADER'; hdr.resize(W, 56); hdr.x = 0; hdr.y = 44;
        hdr.fills = [{ type: 'SOLID', color: WHITE }];
        hdr.strokes = [{ type: 'SOLID', color: BLACK }]; hdr.strokeWeight = BORDER;
        f.appendChild(hdr);
        await txt(hdr, 'SETTINGS', 20, 900, BLACK, 24, 16, 200);
        // Avatar upload
        const av = figma.createEllipse(); av.resize(72, 72); av.x = (W - 72) / 2; av.y = 120;
        av.fills = [{ type: 'SOLID', color: GRAY100 }];
        av.strokes = [{ type: 'SOLID', color: BLACK }]; av.strokeWeight = BORDER;
        f.appendChild(av);
        await txt(f, '⬆  Change Photo', 12, 500, GRAY700, 140, 202, 120);
        inputField(f, 'Display Name', '', 234);
        const bioBox = figma.createFrame();
        bioBox.name = 'BIO'; bioBox.resize(338, 80); bioBox.x = 24; bioBox.y = 302;
        bioBox.fills = [{ type: 'SOLID', color: WHITE }];
        bioBox.strokes = [{ type: 'SOLID', color: BLACK }]; bioBox.strokeWeight = BORDER; bioBox.cornerRadius = 8;
        f.appendChild(bioBox);
        await txt(f, 'SKILLS', 11, 700, GRAY700, 24, 398, 342);
        inputField(f, 'Skills', '', 418);
        await txt(f, 'VERIFICATION STATUS', 11, 700, GRAY700, 24, 490, 342);
        const vCard = card(f, W - 48, 52, 24, 510);
        const vBadge = figma.createFrame(); vBadge.resize(80, 30); vBadge.x = vCard.width - 96; vBadge.y = 11;
        vBadge.fills = [{ type: 'SOLID', color: GREEN }];
        vBadge.strokes = [{ type: 'SOLID', color: BLACK }]; vBadge.strokeWeight = BORDER; vBadge.cornerRadius = 999;
        vCard.appendChild(vBadge);
        await txt(vCard, 'Verification Status', 12, 500, BLACK, 12, 16, 180);
        inputField(f, 'New Password', '', 590);
        const saveBtn = tactileBtn(f, 'SAVE CHANGES', 660);
        await txt(saveBtn, 'SAVE CHANGES', 14, 700, WHITE, 100, 17, 160);
        navDock(f, 760);
    }

    // Done
    figma.currentPage.name = 'RAVE Works Screens';
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
    figma.notify('✅ RAVE Works — all 12 screens generated!', { timeout: 4000 });
}

buildRAVEWorks().catch(err => {
    console.error(err);
    figma.notify('❌ Error: ' + err.message, { error: true });
});
