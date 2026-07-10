document.addEventListener("DOMContentLoaded", () => {
    const viz = document.querySelector('tableau-viz');
    const loader = document.getElementById('viz-loader');

    // Handle Tableau load completion transition
    if (viz) {
        // Wait for firstinteractive event which guarantees Tableau is rendered
        viz.addEventListener('firstinteractive', () => {
            hideLoader();
        });

        // Failsafe timeout (12s) to ensure the container is revealed even if Tableau loading stalls
        setTimeout(() => {
            if (loader && loader.style.display !== 'none') {
                console.warn("Tableau loading exceeded threshold. Transitioning container via failsafe.");
                hideLoader();
            }
        }, 12000);
    }

    function hideLoader() {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 400); // Matches CSS transition time
        }
        if (viz) {
            viz.setAttribute('loaded', 'true');
        }
    }

    // Fullscreen implementation
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen && viz) {
        btnFullscreen.addEventListener('click', () => {
            // Target the wrapper or visualization component directly
            const target = viz;
            if (target.requestFullscreen) {
                target.requestFullscreen();
            } else if (target.webkitRequestFullscreen) { /* Safari */
                target.webkitRequestFullscreen();
            } else if (target.msRequestFullscreen) { /* IE11 */
                target.msRequestFullscreen();
            }
        });
    }

    // Revert/Reset view filters
    const btnRefresh = document.getElementById('btn-refresh');
    if (btnRefresh && viz) {
        btnRefresh.addEventListener('click', async () => {
            btnRefresh.classList.add('spinning');
            try {
                // Check if Embedding API v3 revert function exists
                if (typeof viz.revertAllAsync === 'function') {
                    await viz.revertAllAsync();
                } else {
                    // Fallback to source reload
                    const currentSrc = viz.src;
                    viz.src = '';
                    setTimeout(() => {
                        viz.src = currentSrc;
                    }, 50);
                }
            } catch (err) {
                console.error("Failed to reset visualization filters:", err);
            } finally {
                setTimeout(() => {
                    btnRefresh.classList.remove('spinning');
                }, 600);
            }
        });
    }

    // --- Theme Toggle Management ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Apply saved preferences on load
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentIsLight = document.body.classList.contains('light-theme');
            setTheme(currentIsLight ? 'dark' : 'light');
        });
    }

    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'dark');
        }
    }
});
