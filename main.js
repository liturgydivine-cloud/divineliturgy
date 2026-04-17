/**
 * LITURGICAL STUDIES: MAIN LOGIC ENGINE
 * Automates: Navigation, Tooltips, Dark Mode, and Reading Progress
 */

document.addEventListener("DOMContentLoaded", function() {
    // Detect page number
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const currentNum = parseInt(page.replace('lecture-', '').replace('.html', ''));

    // 1. Reading Time
    const text = document.body.innerText;
    const words = text.split(/\s+/).length;
    const time = Math.ceil(words / 200);

    // 2. Progress Bar & Header Menu
    document.body.insertAdjacentHTML('afterbegin', `<div id="progress-bar"></div>`);
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterbegin', `<p><a href="index.html" style="color: var(--accent); text-decoration: none; font-weight: bold;">← Back to Menu</a></p>`);
        header.insertAdjacentHTML('beforeend', `<span class="reading-time">⏱️ ${time} min read</span>`);
    }

    // 3. Footnote Peeking Tooltip
    const toolTip = document.createElement('div');
    toolTip.className = 'footnote-tooltip';
    document.body.appendChild(toolTip);

    document.querySelectorAll('sup a').forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            const fnId = this.getAttribute('href').substring(1);
            const fnElement = document.getElementById(fnId);
            if (fnElement) {
                const fnText = fnElement.innerText.replace('↩', '').trim();
                toolTip.innerText = fnText;
                toolTip.style.display = 'block';
                toolTip.style.left = (e.pageX - 150) + 'px';
                toolTip.style.top = (e.pageY + 25) + 'px';
            }
        });
        link.addEventListener('mouseleave', () => toolTip.style.display = 'none');
    });

    // 4. Dark Mode Toggle
    document.body.insertAdjacentHTML('beforeend', `<button id="theme-toggle" title="Toggle Vesper Mode">🌙</button>`);
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newMode = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newMode);
        toggle.innerText = newMode === 'dark' ? '☀️' : '🌙';
    });

    // 5. Numbered Navigation Buttons
    const navCont = document.getElementById('nav-placeholder');
    if (navCont && !isNaN(currentNum)) {
        const nextNum = currentNum + 1;
        const nextFile = `lecture-${nextNum.toString().padStart(2, '0')}.html`;
        // --- BUTTON NUMBER FIX APPLIED BELOW ---
        const nextBtn = currentNum < 19 ? `<a href="${nextFile}" class="btn btn-next">Next Lecture: ${nextNum} →</a>` : '';
        
        navCont.innerHTML = `<div class="nav-buttons"><a href="index.html" class="btn btn-home">🏠 Home Menu</a>${nextBtn}</div>`;
    }

    // 6. Scroll Tracking
    document.body.insertAdjacentHTML('beforeend', `<button id="scrollToTop">↑</button>`);
    const topBtn = document.getElementById('scrollToTop');
    window.onscroll = () => {
        let winScroll = document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";
        topBtn.style.display = winScroll > 400 ? "block" : "none";
    };
    topBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});

    // 7. Footer
    const container = document.querySelector('.container');
    if (container) {
        const footer = document.createElement('footer');
        footer.innerHTML = `<hr><p style="text-align:center; opacity:0.6; margin-top:20px; font-size:0.8rem; padding-bottom:40px;">&copy; ${new Date().getFullYear()} Liturgical Studies Series</p>`;
        container.appendChild(footer);
    }
});
