/* ============================================================
   shared-nav.js  —  Injects the common navbar + footer
   Include AFTER <body> opens on every page
   ============================================================ */

(function () {

    /* ── Detect active page ── */
    const page = location.pathname.split('/').pop() || 'index.html';
    const isActive = (href) => page === href ? 'active' : '';

    /* ── Check login ── */
    const session =
        JSON.parse(localStorage.getItem('cattleai_user') || 'null') ||
        JSON.parse(sessionStorage.getItem('cattleai_user') || 'null');

    /* ── Inject CSS Variables + Base Styles ── */
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --g-dark:  #1a3a2a;
            --g-mid:   #2d6a4f;
            --g-light: #52b788;
            --amber:   #e9a825;
            --cream:   #f8f4ec;
            --white:   #ffffff;
            --text:    #1a1a1a;
            --muted:   #64748b;
            --border:  #dde3d5;
            --shadow:  0 2px 16px rgba(0,0,0,0.08);
        }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        /* ──── NAVBAR ──── */
        .nav-bar {
            position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
            background: rgba(255,255,255,0.96);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            height: 68px;
            display: flex; align-items: center;
            padding: 0 32px;
            gap: 0;
        }

        /* LEFT — Logo */
        .nav-logo {
            display: flex; align-items: center; gap: 10px;
            text-decoration: none;
            flex-shrink: 0;
        }
        .nav-logo-icon {
            width: 42px; height: 42px;
            background: linear-gradient(135deg, var(--g-mid), var(--g-dark));
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 22px;
        }
        .nav-logo-text {
            display: flex; flex-direction: column;
            line-height: 1.1;
        }
        .nav-logo-name {
            font-family: 'Playfair Display', serif;
            font-size: 18px; font-weight: 700;
            color: var(--g-dark);
        }
        .nav-logo-sub {
            font-size: 10px; font-weight: 600;
            color: var(--muted);
            letter-spacing: 1px; text-transform: uppercase;
        }

        /* CENTER — Nav links */
        .nav-links {
            flex: 1;
            display: flex; align-items: center; justify-content: center;
            gap: 6px;
            list-style: none; margin: 0; padding: 0;
        }
        .nav-links a {
            text-decoration: none;
            font-family: 'Mulish', sans-serif;
            font-size: 14px; font-weight: 600;
            color: var(--muted);
            padding: 7px 16px;
            border-radius: 8px;
            transition: color 0.2s, background 0.2s;
            letter-spacing: 0.2px;
        }
        .nav-links a:hover, .nav-links a.active {
            color: var(--g-mid);
            background: rgba(45,106,79,0.08);
        }
        .nav-links a.active { color: var(--g-dark); font-weight: 700; }

        /* RIGHT — Social + User */
        .nav-right {
            display: flex; align-items: center; gap: 10px;
            flex-shrink: 0;
        }
        .social-btn {
            width: 36px; height: 36px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            text-decoration: none; font-size: 17px;
            transition: transform 0.2s, background 0.2s;
            background: var(--cream);
        }
        .social-btn:hover { transform: scale(1.15); background: var(--border); }

        .nav-user {
            display: flex; align-items: center; gap: 8px;
            padding: 6px 14px 6px 8px;
            background: var(--cream);
            border-radius: 24px;
            cursor: pointer;
            border: 1px solid var(--border);
            transition: background 0.2s;
        }
        .nav-user:hover { background: var(--border); }
        .nav-user-avatar {
            width: 30px; height: 30px;
            background: linear-gradient(135deg, var(--g-mid), var(--g-dark));
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 13px; font-weight: 700;
        }
        .nav-user-name {
            font-size: 13px; font-weight: 600; color: var(--text);
            font-family: 'Mulish', sans-serif;
        }

        .btn-nav-login {
            padding: 8px 20px;
            background: var(--g-mid);
            color: white;
            border: none; border-radius: 8px;
            font-size: 13px; font-weight: 700;
            font-family: 'Mulish', sans-serif;
            cursor: pointer; text-decoration: none;
            transition: background 0.2s, transform 0.2s;
            display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-nav-login:hover { background: var(--g-dark); transform: translateY(-1px); }

        /* ──── PAGE BODY OFFSET ──── */
        body { padding-top: 68px; }

        /* ──── FOOTER ──── */
        .site-footer {
            background: var(--g-dark);
            color: rgba(255,255,255,0.7);
            padding: 50px 60px 28px;
            margin-top: 80px;
        }
        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 40px;
            padding-bottom: 40px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .footer-brand-name {
            font-family: 'Playfair Display', serif;
            font-size: 22px; color: white; font-weight: 700;
            margin-bottom: 10px;
        }
        .footer-brand-desc {
            font-size: 13px; line-height: 1.7;
            color: rgba(255,255,255,0.55);
            max-width: 260px;
        }
        .footer-col-title {
            font-size: 11px; font-weight: 700;
            letter-spacing: 1.5px; text-transform: uppercase;
            color: var(--amber); margin-bottom: 14px;
        }
        .footer-links { list-style: none; }
        .footer-links li { margin-bottom: 8px; }
        .footer-links a {
            color: rgba(255,255,255,0.6);
            text-decoration: none; font-size: 13px;
            transition: color 0.2s;
        }
        .footer-links a:hover { color: white; }
        .footer-bottom {
            padding-top: 24px;
            display: flex; justify-content: space-between; align-items: center;
            font-size: 12px; color: rgba(255,255,255,0.4);
            flex-wrap: wrap; gap: 8px;
        }
        .footer-socials { display: flex; gap: 10px; }
        .footer-social-btn {
            width: 34px; height: 34px;
            background: rgba(255,255,255,0.08);
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            font-size: 15px; text-decoration: none;
            transition: background 0.2s;
        }
        .footer-social-btn:hover { background: rgba(255,255,255,0.15); }

        @media (max-width: 900px) {
            .nav-bar { padding: 0 16px; }
            .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
            .nav-links { display: none; }
            .footer-grid { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(style);

    /* ── Google Fonts ── */
    const gf = document.createElement('link');
    gf.rel = 'stylesheet';
    gf.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Mulish:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(gf);

    /* ── Build Navbar HTML ── */
    const userHtml = session
        ? `<div class="nav-user" onclick="logoutUser()">
               <div class="nav-user-avatar">${session.name.charAt(0)}</div>
               <div class="nav-user-name">${session.name.split(' ')[0]}</div>
               <span style="font-size:11px;margin-left:2px;color:var(--muted)">▾</span>
           </div>`
        : `<a href="login.html" class="btn-nav-login">🔐 Login</a>`;

    const nav = document.createElement('nav');
    nav.className = 'nav-bar';
    nav.innerHTML = `
        <!-- LOGO LEFT -->
        <a href="index.html" class="nav-logo">
            <div class="nav-logo-icon">🐄</div>
            <div class="nav-logo-text">
                <span class="nav-logo-name">CattleAI</span>
                <span class="nav-logo-sub">Health Monitor</span>
            </div>
        </a>

        <!-- LINKS CENTER -->
        <ul class="nav-links">
            <li><a href="index.html"          class="${isActive('index.html')}">Home</a></li>
            <li><a href="pages/about.html"    class="${isActive('about.html')}">About</a></li>
            <li><a href="pages/services.html" class="${isActive('services.html')}">Services</a></li>
            <li><a href="pages/faq.html"      class="${isActive('faq.html')}">FAQ</a></li>
            <li><a href="pages/contact.html"  class="${isActive('contact.html')}">Contact Us</a></li>
        </ul>

        <!-- SOCIAL + USER RIGHT -->
        <div class="nav-right">
            <a class="social-btn" href="https://wa.me/" target="_blank"     title="WhatsApp">💬</a>
            <a class="social-btn" href="https://twitter.com/" target="_blank" title="Twitter">🐦</a>
            <a class="social-btn" href="https://facebook.com/" target="_blank" title="Facebook">👍</a>
            ${userHtml}
        </div>
    `;
    document.body.insertBefore(nav, document.body.firstChild);

    /* ── Build Footer HTML ── */
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="footer-grid">
            <div>
                <div class="footer-brand-name">🐄 CattleAI</div>
                <div class="footer-brand-desc">
                    AI-powered cattle health monitoring that helps farmers detect lameness
                    and diseases early — improving animal welfare and farm productivity.
                </div>
            </div>
            <div>
                <div class="footer-col-title">Quick Links</div>
                <ul class="footer-links">
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="faq.html">FAQ</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div>
                <div class="footer-col-title">Services</div>
                <ul class="footer-links">
                    <li><a href="#">Gait Analysis</a></li>
                    <li><a href="#">Disease Detection</a></li>
                    <li><a href="#">Health Reports</a></li>
                    <li><a href="#">Lameness Scoring</a></li>
                </ul>
            </div>
            <div>
                <div class="footer-col-title">Contact</div>
                <ul class="footer-links">
                    <li><a href="#">📧 info@cattleai.com</a></li>
                    <li><a href="#">📞 +91 98765 43210</a></li>
                    <li><a href="#">📍 Tiruchirappalli, TN</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© 2026 CattleAI Health Monitor. All rights reserved.</span>
            <div class="footer-socials">
                <a class="footer-social-btn" href="https://wa.me/" target="_blank">💬</a>
                <a class="footer-social-btn" href="https://twitter.com/" target="_blank">🐦</a>
                <a class="footer-social-btn" href="https://facebook.com/" target="_blank">👍</a>
            </div>
        </div>
    `;
    document.body.appendChild(footer);

    /* ── Logout helper ── */
    window.logoutUser = function () {
        if (confirm('Sign out of CattleAI?')) {
            localStorage.removeItem('cattleai_user');
            sessionStorage.removeItem('cattleai_user');
            window.location.href = '../login.html';
        }
    };

})();