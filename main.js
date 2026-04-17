document.addEventListener("DOMContentLoaded", function() {
    // 1. Identify current lecture number from the filename (e.g., lecture-05.html -> 5)
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const currentNum = parseInt(page.replace('lecture-', '').replace('.html', ''));

    // 2. Insert Top Navigation (Back to Menu)
    const header = document.querySelector('header');
    if (header) {
        const topNav = document.createElement('p');
        topNav.innerHTML = `<a href="index.html" style="color: var(--accent); text-decoration: none; font-weight: bold;">← Back to Menu</a>`;
        header.prepend(topNav);
    }

    // 3. Insert Bottom Navigation (Home and Next)
    const navContainer = document.getElementById('nav-placeholder');
    if (navContainer && !isNaN(currentNum)) {
        const nextNum = currentNum + 1;
        const nextFile = `lecture-${nextNum.toString().padStart(2, '0')}.html`;
        
        let nextButton = '';
        // Only show "Next" button if we aren't on the last lecture (19)
        if (currentNum < 19) {
            nextButton = `<a href="${nextFile}" class="btn btn-next">Next Lecture: ${nextNum} →</a>`;
        }

        navContainer.innerHTML = `
            <div class="nav-buttons">
                <a href="index.html" class="btn btn-home">🏠 Home Menu</a>
                ${nextButton}
            </div>
        `;
    }
    
    // 4. Insert Global Footer
    const container = document.querySelector('.container');
    if (container) {
        const footer = document.createElement('footer');
        footer.innerHTML = `<hr><p style="text-align:center; opacity:0.6; margin-top:20px;">&copy; ${new Date().getFullYear()} Liturgical Studies Series</p>`;
        container.appendChild(footer);
    }

        // Footnote Peeking ---
    const toolTip = document.createElement('div');
    toolTip.className = 'footnote-tooltip';
    document.body.appendChild(toolTip);

    document.querySelectorAll('sup a').forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            const fnId = this.getAttribute('href').substring(1);
            const fnText = document.getElementById(fnId).innerText.replace('↩', '');
            toolTip.innerText = fnText;
            toolTip.style.display = 'block';
            toolTip.style.left = e.pageX + 'px';
            toolTip.style.top = (e.pageY + 20) + 'px';
        });
        link.addEventListener('mouseleave', () => toolTip.style.display = 'none');
    });
});