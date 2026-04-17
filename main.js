/**
 * LITURGICAL STUDIES: MAIN LOGIC ENGINE
 * Automates: Navigation, Tooltips, Dark Mode, and Reading Progress
 */

document.addEventListener("DOMContentLoaded", function() {
    // --- 1. CONFIGURATION & PAGE DETECTION ---
    const path = window.location.pathname;
    const page = path.split("/").pop();
    // Extracts number from 'lecture-05.html' result: 5
    const currentNum = parseInt(page.replace('lecture-', '').replace('.html', ''));

    // --- 2. READING TIME CALCULATION ---
    const text = document.body.innerText;
    const words = text.split(/\s+/).length;
    const wpm = 200; // Average reading speed
    const time = Math.ceil(words / wpm);

    // --- 3. UI INITIALIZATION (Header & Progress Bar) ---
    // Add the top gold progress bar
    document.body.insertAdjacentHTML('afterbegin', `<div id="progress-bar"></div>`);
    
    const header = document.querySelector('header');
    if (header) {
        // Auto-insert 'Back to Menu' at the top of every lecture
        header.insertAdjacentHTML('afterbegin', `<p><a href="index.html" style="color: var(--accent); text-decoration: none; font-weight: bold;">← Back to Menu</a></p>`);
        // Display the calculated reading time
        header.insertAdjacentHTML('beforeend', `<span class="reading-time">⏱️ ${time} min read</span>`);
    }

    // --- 4. FOOTNOTE PEEKING ENGINE ---
    // Creates the hidden tooltip bubble
    const toolTip = document.createElement('div');
    toolTip.className = 'footnote-tooltip';
    document.body.appendChild(toolTip);

    // Attach listeners to all footnote links (sup a)
    document.querySelectorAll('sup a').forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            const fnId = this.getAttribute('href').substring(1); // gets 'fn1'
            const fnElement = document.getElementById(fnId);
            if (fnElement) {
                // Remove the 'back arrow' ↩ from the preview text
                const fnText = fnElement.innerText.replace('↩', '').trim();
                toolTip.innerText = fnText;
                toolTip.style.display = 'block';
                // Positioning logic
                toolTip.style.left = (e.pageX - 150) + 'px';
                toolTip.style.top = (e.pageY + 25) + 'px';
            }
        });
        link.addEventListener('mouseleave', () => {
            toolTip.style.display = 'none';
        });
    });

    // --- 5. THEME CONTROLLER (Dark Mode) ---
    document.body.insertAdjacentHTML('beforeend', `<button id="theme-toggle" title="Toggle Vesper Mode">🌙</button>`);
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newMode = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newMode);
        toggle.innerText = newMode === 'dark' ? '☀️' : '🌙';
    });

    // --- 6. AUTOMATED NAVIGATION BUTTONS ---
    const navCont = document.getElementById('nav-placeholder');
    if (navCont && !isNaN(currentNum)) {
        const nextNum = currentNum + 1;
        // Formats number to 2 digits (e.g. 6 -> '06')
        const nextFile = `lecture-${nextNum.toString().padStart(2, '0')}.html`;
        // Hide next button if we are on the final lecture (19)
        const nextBtn = currentNum < 19 ? `<a href="${nextFile}" class="btn btn-next">Next Lecture →</a>` : '';
        
        navCont.innerHTML = `
            <div class="nav-buttons">
                <a href="index.html" class="btn btn-home">🏠 Home Menu</a>
                ${nextBtn}
            </div>
        `;
    }

    // --- 7. SCROLL TRACKING & BACK TO TOP ---
    document.body.insertAdjacentHTML('beforeend', `<button id="scrollToTop">↑</button>`);
    const topBtn = document.getElementById('scrollToTop');
    
    window.onscroll = () => {
        let winScroll = document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        // Update progress bar width
        document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";
        // Show scroll-to-top button after scrolling 400px
        topBtn.style.display = winScroll > 400 ? "block" : "none";
    };
    
    topBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});

    // --- 8. DYNAMIC GLOBAL FOOTER ---
    const container = document.querySelector('.container');
    if (container) {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <hr>
            <p style="text-align:center; opacity:0.6; margin-top:20px; font-size:0.8rem; padding-bottom:40px;">
                &copy; ${new Date().getFullYear()} Liturgical Studies Series
            </p>
        `;
        container.appendChild(footer);
    }
});