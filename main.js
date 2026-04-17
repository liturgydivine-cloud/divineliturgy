document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const currentNum = parseInt(page.replace('lecture-', '').replace('.html', ''));

    // 1. Reading Time Calculation
    const text = document.body.innerText;
    const words = text.split(/\s+/).length;
    const time = Math.ceil(words / 200);

    // 2. Build UI Components (Header & Progress)
    document.body.insertAdjacentHTML('afterbegin', `<div id="progress-bar"></div>`);
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterbegin', `<p><a href="index.html" style="color: var(--accent); text-decoration: none; font-weight: bold;">← Back to Menu</a></p>`);
        header.insertAdjacentHTML('beforeend', `<span class="reading-time">⏱️ ${time} min read</span>`);
    }

    // 3. Footnote Peeking Logic (RESORED)
    const toolTip = document.createElement('div');
    toolTip.className = 'footnote-tooltip';
    document.body.appendChild(toolTip);

    document.querySelectorAll('sup a').forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            const fnId = this.getAttribute('href').substring(1);
            const fnElement = document.getElementById(fnId);
            if (fnElement) {
                // Get text and remove the back-link arrow ↩
                const fnText = fnElement.innerText.replace('↩', '').trim();
                toolTip.innerText = fnText;
                toolTip.style.display = 'block';
                toolTip.style.left = (e.pageX - 150) + 'px'; // Center it somewhat
                toolTip.style.top = (e.pageY + 25) + 'px';
            }
        });
        link.addEventListener('mouseleave', () => {
            toolTip.style.display = 'none';
        });
    });

    // 4. Theme Toggle (Vesper Mode)
    document.body.insertAdjacentHTML('beforeend', `<button id="theme-toggle" title="Toggle Vesper Mode">🌙</button>`);
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        const mode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', mode);
        toggle.innerText = mode === 'dark' ? '☀️' : '🌙';
    });

    // 5. Navigation Buttons Placeholder
    const navCont = document.getElementById('nav-placeholder');
    if (navCont && !isNaN(currentNum)) {
        const nextNum = currentNum + 1;
        const nextFile = `lecture-${nextNum.toString().padStart(2, '0')}.html`;
        const nextBtn = currentNum < 19 ? `<a href="${nextFile}" class="btn btn-next">Next Lecture →</a>` : '';
        navCont.innerHTML = `<div class="nav-buttons"><a href="index.html" class="btn btn-home">🏠 Home Menu</a>${nextBtn}</div>`;
    }

    // 6. Scroll to Top & Global Footer
    document.body.insertAdjacentHTML('beforeend', `<button id="scrollToTop">↑</button>`);
    const topBtn = document.getElementById('scrollToTop');
    window.onscroll = () => {
        let winScroll = document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";
        topBtn.style.display = winScroll > 400 ? "block" : "none";
    };
    topBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});

    const container = document.querySelector('.container');
    if (container) {
        const footer = document.createElement('footer');
        footer.innerHTML = `<hr><p style="text-align:center; opacity:0.6; margin-top:20px; font-size:0.8rem; padding-bottom:40px;">&copy; ${new Date().getFullYear()} Liturgical Studies Series</p>`;
        container.appendChild(footer);
    }
});
