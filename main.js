document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const currentNum = parseInt(page.replace('lecture-', '').replace('.html', ''));

    // 1. Reading Time Calculation
    const text = document.body.innerText;
    const wpm = 200;
    const words = text.split(/\s+/).length;
    const time = Math.ceil(words / wpm);

    // 2. Add Progress Bar and Reading Time
    document.body.insertAdjacentHTML('afterbegin', `<div id="progress-bar"></div>`);
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterbegin', `<p><a href="index.html" style="color: var(--accent); text-decoration: none; font-weight: bold;">← Back to Menu</a></p>`);
        header.insertAdjacentHTML('beforeend', `<span class="reading-time">⏱️ ${time} min read</span>`);
    }

    // 3. Theme Toggle (Vesper Mode)
    document.body.insertAdjacentHTML('beforeend', `<button id="theme-toggle" title="Toggle Vesper Mode">🌙</button>`);
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        const mode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', mode);
        toggle.innerText = mode === 'dark' ? '☀️' : '🌙';
    });

    // 4. Generate Navigation Buttons
    const navCont = document.getElementById('nav-placeholder');
    if (navCont && !isNaN(currentNum)) {
        const nextNum = currentNum + 1;
        const nextFile = `lecture-${nextNum.toString().padStart(2, '0')}.html`;
        const nextBtn = currentNum < 19 ? `<a href="${nextFile}" class="btn btn-next">Next Lecture →</a>` : '';
        navCont.innerHTML = `<div class="nav-buttons"><a href="index.html" class="btn btn-home">🏠 Home Menu</a>${nextBtn}</div>`;
    }

    // 5. Scroll Progress and Back to Top
    document.body.insertAdjacentHTML('beforeend', `<button id="scrollToTop">↑</button>`);
    const topBtn = document.getElementById('scrollToTop');
    window.onscroll = () => {
        let winScroll = document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";
        topBtn.style.display = winScroll > 300 ? "block" : "none";
    };
    topBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
});
