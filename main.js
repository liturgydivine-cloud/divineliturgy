/**
 * LITURGICAL STUDIES: MAIN LOGIC ENGINE
 * Author: Deacon Wannas
 * Automates: Navigation, Tooltips, Persistent Dark Mode, and Reading Progress
 */

document.addEventListener("DOMContentLoaded", function() {
    // Detect current page details
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html"; // Default to index
    const isLecture = page.includes('lecture-');
    const currentNum = isLecture ? parseInt(page.replace('lecture-', '').replace('.html', '')) : null;

    // --- 1. PERSISTENT THEME (VESPER MODE) ---
    // Check for saved theme in browser storage, default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Add Toggle Button
    document.body.insertAdjacentHTML('beforeend', `<button id="theme-toggle" title="Toggle Vesper Mode">${savedTheme === 'dark' ? '☀️' : '🌙'}</button>`);
    
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newMode = isDark ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newMode);
        localStorage.setItem('theme', newMode); // Save preference
        toggle.innerText = newMode === 'dark' ? '☀️' : '🌙';
    });


    // --- 2. LECTURE-ONLY FEATURES ---
    if (isLecture) {
        // A. Reading Time Calculation
        const text = document.querySelector('.container')?.innerText || "";
        const time = Math.ceil(text.split(/\s+/).length / 200);

        // B. Progress Bar & Header Setup
        document.body.insertAdjacentHTML('afterbegin', `<div id="progress-bar"></div>`);
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('afterbegin', `<p><a href="index.html" style="color: var(--accent); text-decoration: none; font-weight: bold;">← Back to Menu</a></p>`);
            header.insertAdjacentHTML('beforeend', `<span class="reading-time">⏱️ ${time} min read</span>`);
        }

        // C. Footnote Peeking Tooltip
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
                    
                    // Positioning: Center tooltip above the link
                    toolTip.style.left = (e.pageX - 150) + 'px';
                    toolTip.style.top = (e.pageY + 25) + 'px';
                }
            });
            link.addEventListener('mouseleave', () => toolTip.style.display = 'none');
        });

        // D. Automated Navigation Buttons
        const navCont = document.getElementById('nav-placeholder');
        if (navCont && !isNaN(currentNum)) {
            const nextNum = currentNum + 1;
            const nextFile = `lecture-${nextNum.toString().padStart(2, '0')}.html`;
            const nextBtn = currentNum < 19 ? `<a href="${nextFile}" class="btn btn-next">Next Lecture: ${nextNum} →</a>` : '';
            navCont.innerHTML = `<div class="nav-buttons"><a href="index.html" class="btn btn-home">🏠 Home Menu</a>${nextBtn}</div>`;
        }
    }


    // --- 3. GLOBAL FEATURES (Lectures & Index) ---

    // A. Scroll to Top Tracking
    document.body.insertAdjacentHTML('beforeend', `<button id="scrollToTop">↑</button>`);
    const topBtn = document.getElementById('scrollToTop');
    const progressBar = document.getElementById("progress-bar");

    window.onscroll = () => {
        let winScroll = document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Update progress bar if it exists (lecture pages)
        if (progressBar) {
            progressBar.style.width = (winScroll / height) * 100 + "%";
        }
        
        // Show/Hide back-to-top button
        topBtn.style.display = winScroll > 400 ? "block" : "none";
    };
    
    topBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});

    // B. Global Footer
    // Appends to .container on lectures, or body on index
    const footerParent = document.querySelector('.container') || document.body;
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <hr style="width: 80%; margin: 40px auto; opacity: 0.2;">
        <p style="text-align:center; opacity:0.6; margin-top:20px; font-size:0.8rem; padding-bottom:40px;">
            &copy; ${new Date().getFullYear()} Liturgical Studies Series | Deacon Wannas
        </p>
    `;
    footerParent.appendChild(footer);
});