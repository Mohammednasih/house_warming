document.addEventListener('DOMContentLoaded', () => {
    // 1. Music Player Setup
    const musicBtn = document.getElementById('music-toggle');
    const musicIcon = musicBtn.querySelector('i');
    const audio = document.getElementById('bg-music');
    let isPlaying = false;

    // Toggle Music play/pause
    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            musicIcon.classList.remove('animate-spin');
            isPlaying = false;
        } else {
            audio.play().then(() => {
                musicIcon.classList.add('animate-spin');
                isPlaying = true;
            }).catch(err => {
                console.log("Audio play blocked by browser policies: ", err);
            });
        }
    }

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });

    // Auto-play attempt on first user click anywhere inside the app container
    const appContainer = document.querySelector('.app-container');
    const playOnFirstInteraction = () => {
        if (!isPlaying) {
            toggleMusic();
        }
        // Remove the listener once the interaction happened
        appContainer.removeEventListener('click', playOnFirstInteraction);
        appContainer.removeEventListener('touchstart', playOnFirstInteraction);
    };

    appContainer.addEventListener('click', playOnFirstInteraction);
    appContainer.addEventListener('touchstart', playOnFirstInteraction);

    // Pause music when tab is inactive, resume when active
    let wasPlayingBeforeHidden = false;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isPlaying) {
                audio.pause();
                musicIcon.classList.remove('animate-spin');
                isPlaying = false;
                wasPlayingBeforeHidden = true;
            }
        } else {
            if (wasPlayingBeforeHidden) {
                audio.play().then(() => {
                    musicIcon.classList.add('animate-spin');
                    isPlaying = true;
                }).catch(err => {
                    console.log("Audio resume blocked on tab focus: ", err);
                });
                wasPlayingBeforeHidden = false;
            }
        }
    });

    // 1.5 Loading Screen Cover Setup
    const loadingScreen = document.getElementById('loading-screen');
    const progressContainer = document.getElementById('progress-bar-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const openPrompt = document.getElementById('open-prompt');
    let progress = 0;
    let isLoaded = false;

    // Simulate progress bar loading (takes 2 seconds)
    const loadingInterval = setInterval(() => {
        progress += 2;
        if (progressBarFill) {
            progressBarFill.style.width = progress + '%';
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            isLoaded = true;
            
            // Fade out loading bar and show touch to open
            if (progressContainer) {
                progressContainer.style.opacity = '0';
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                    if (openPrompt) {
                        openPrompt.classList.remove('hidden-prompt');
                    }
                }, 400);
            }
        }
    }, 40);

    // Touch to open event
    if (loadingScreen) {
        loadingScreen.addEventListener('click', (e) => {
            if (isLoaded) {
                // Dismiss cover screen with descent transition
                loadingScreen.classList.add('dismissed');
                
                // Play music on this first touch
                if (!isPlaying) {
                    toggleMusic();
                }
                
                // Clean up listeners
                appContainer.removeEventListener('click', playOnFirstInteraction);
                appContainer.removeEventListener('touchstart', playOnFirstInteraction);
            }
        });
    }


    // 2. Intersection Observer for Scroll Animations (Fade-in effects)
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    const observerOptions = {
        root: document.querySelector('.invitation-scroll'),
        rootMargin: '0px',
        threshold: 0.15 // Section is 15% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing after showing once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeSections.forEach(section => {
        observer.observe(section);
    });

    // 3. Countdown Timer Functionality
    const targetDate = new Date("August 1, 2026 11:00:00").getTime();
    
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-mins');
    const secsEl = document.getElementById('countdown-secs');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        if (difference < 0) {
            // Event has started / completed
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minsEl) minsEl.innerText = "00";
            if (secsEl) secsEl.innerText = "00";
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Pad with leading zero if single digit
        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minsEl) minsEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secsEl) secsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }
    
    // Initial call
    updateCountdown();
    // Update every second
    setInterval(updateCountdown, 1000);
});
