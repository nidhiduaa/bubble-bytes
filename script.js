document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation ---
    const sections = [
        'landing',
        'celebration',
        'show-it-started', // Note: ID in HTML was 'how-it-started' but logic might just order by index
        'gift-card',
        'brain-map',
        'slot-machine',
        'moment-changed',
        'baking',
        'mini-game',
        'love-letter',
        'multiverse',
        'hold-commit',
        'final-page'
    ];

    // Actually simpler to just querySelectorAll('section') to get them in order
    const sectionElements = document.querySelectorAll('section');
    let currentSectionIndex = 0;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    function updateSection() {
        sectionElements.forEach((sec, index) => {
            if (index === currentSectionIndex) {
                sec.classList.remove('hidden');
                sec.classList.add('active'); // Add active class for fade-in
            } else {
                sec.classList.add('hidden');
                sec.classList.remove('active');
            }
        });

        // Button visibility
        if (currentSectionIndex === 0) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden'); // Logic says "next" appears after interactions or manually?
            // "Yes" button handles the first transition
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
        }

        // Specific section initialization
        if (sectionElements[currentSectionIndex].id === 'gift-card') initScratchCard();
        if (sectionElements[currentSectionIndex].id === 'mini-game') initMiniGame();
    }

    // --- Landing Page ---
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');

    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
        noBtn.style.position = 'absolute';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    });

    yesBtn.addEventListener('click', () => {
        currentSectionIndex++;
        updateSection();
        createConfetti();
    });

    // --- Navigation Buttons ---
    nextBtn.addEventListener('click', () => {
        if (currentSectionIndex < sectionElements.length - 1) {
            currentSectionIndex++;
            updateSection();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            updateSection();
        }
    });

    // --- Scratch Card ---
    function initScratchCard() {
        const canvas = document.getElementById('scratch-canvas');
        const ctx = canvas.getContext('2d');
        const container = document.querySelector('.scratch-container');

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        ctx.fillStyle = '#C0C0C0'; // Silver
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text on canvas
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText("Scratch Me!", canvas.width / 2 - 50, canvas.height / 2);

        let isDrawing = false;

        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mousemove', scratch);

        canvas.addEventListener('touchstart', () => isDrawing = true);
        canvas.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('touchmove', scratch);
    }

    // --- Slot Machine ---
    const spinBtn = document.getElementById('spin-btn');
    const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];

    // Placeholder images for slot items
    const outcomes = [
        'https://placehold.co/80x80/ff99aa/590d22?text=Pizza',
        'https://placehold.co/80x80/ffb3c1/590d22?text=Movie',
        'https://placehold.co/80x80/ffccd5/590d22?text=Car',
        'https://placehold.co/80x80/ffe5ec/590d22?text=Rain',
        'https://placehold.co/80x80/fff0f5/590d22?text=Music'
    ];

    // Final winning combination images
    const winImages = [
        'https://placehold.co/80x80/ff69b4/ffffff?text=You',
        'https://placehold.co/80x80/ff1493/ffffff?text=+',
        'https://placehold.co/80x80/c9184a/ffffff?text=Me'
    ];

    function setSlotImage(slotElement, imageUrl) {
        slotElement.innerHTML = `<img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
    }

    spinBtn.addEventListener('click', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            slots.forEach(slot => {
                const randomImg = outcomes[Math.floor(Math.random() * outcomes.length)];
                setSlotImage(slot, randomImg);
            });
            iterations++;
            if (iterations > 20) {
                clearInterval(interval);
                // Force Win
                setSlotImage(slots[0], winImages[0]);
                setSlotImage(slots[1], winImages[1]);
                setSlotImage(slots[2], winImages[2]);

                document.getElementById('slot-message').textContent = "You + Me + Forever! ❤️";
                document.getElementById('slot-message').classList.remove('hidden');
            }
        }, 100);
    });

    // --- Baking ---
    const ingredients = document.querySelectorAll('.ingredient-btn');
    let stepsCompleted = 0;

    ingredients.forEach(btn => {
        btn.addEventListener('click', () => {
            stepsCompleted++;
            btn.disabled = true;
            btn.style.opacity = '0.5';

            if (stepsCompleted === 3) {
                document.getElementById('baking-status').textContent = "Result: Our sweet relationship! 🧁";
                // Animation for sprinkles/cupcake could go here
                document.getElementById('bowl').style.filter = "none"; // Colour it
            }
        });
    });

    // --- Brain Map ---
    const brainMap = document.getElementById('brain-map');
    // Changed selector to match new class
    const brainParts = document.querySelectorAll('.brain-bubble');
    const brainPopup = document.getElementById('brain-popup');

    if (brainMap) {
        brainParts.forEach(part => {
            part.addEventListener('click', (e) => {
                // Ensure text is grabbed correctly
                brainPopup.textContent = part.dataset.text;
                brainPopup.classList.remove('hidden');

                // Add a cute pop animation reset
                brainPopup.style.animation = 'none';
                void brainPopup.offsetWidth; // trigger reflow
                brainPopup.style.animation = 'pulse 0.5s';
            });
        });

        // Hide popup when clicking elsewhere in the section
        brainMap.addEventListener('click', (e) => {
            if (!e.target.closest('.brain-bubble')) {
                brainPopup.classList.add('hidden');
            }
        });
    }

    // --- Multiverse ---
    const universeBtns = document.querySelectorAll('.universe-btn');
    const universeMessage = document.getElementById('universe-message');

    const universeTexts = {
        space: "Even in infinite galaxies, I’d still search for your hand. 🌌",
        fantasy: "In a world of dragons and magic, you are my greatest treasure. 🐉",
        cyber: "In a neon future, you are the only signal I need. 🤖",
        nature: "Like a tree needs rain, I need you. 🌿"
    };

    if (universeMessage) {
        universeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                const text = universeTexts[theme] || "";
                universeMessage.textContent = text + "\n\nBecause in every version of reality, it’s you.";
                universeMessage.classList.remove('hidden');
            });
        });
    }

    // --- Mini Game: Catch Hearts ---
    function initMiniGame() {
        const gameArea = document.getElementById('game-area');
        const catcher = document.getElementById('catcher');
        let score = 0;
        let gameInterval;
        let catcherX = 150;
        let isGameOver = false;

        // Reset state
        score = 0;
        isGameOver = false;
        document.getElementById('score').textContent = score;
        document.getElementById('unlock-letter-btn').classList.add('hidden');

        // Move catcher
        gameArea.addEventListener('mousemove', (e) => {
            if (isGameOver) return;
            const rect = gameArea.getBoundingClientRect();
            catcherX = e.clientX - rect.left;
            // Bound checks
            if (catcherX < 0) catcherX = 0;
            if (catcherX > 260) catcherX = 260; // 300 - catcher width approx
            catcher.style.left = `${catcherX}px`;
        });

        function spawnHeart() {
            if (isGameOver) return;

            const heart = document.createElement('div');
            heart.classList.add('falling-heart');
            heart.textContent = '❤️';
            heart.style.left = Math.random() * 260 + 'px';
            gameArea.appendChild(heart);

            let pos = -30;
            const fall = setInterval(() => {
                if (isGameOver) {
                    clearInterval(fall);
                    heart.remove();
                    return;
                }

                pos += 5;
                heart.style.top = pos + 'px';

                const catcherRect = catcher.getBoundingClientRect();
                const heartRect = heart.getBoundingClientRect();

                // Collision Detection
                if (pos > 340 && // Near bottom but caught
                    heartRect.bottom >= catcherRect.top &&
                    heartRect.left < catcherRect.right &&
                    heartRect.right > catcherRect.left) { // Simple box overlap
                    score++;
                    document.getElementById('score').textContent = score;
                    clearInterval(fall);
                    heart.remove();
                    if (score >= 10) winGame();
                }

                // Missed Heart Logic
                if (pos > 380) { // Hit bottom
                    clearInterval(fall);
                    heart.remove();
                    endGame(); // GAME OVER
                }
            }, 50);
        }

        gameInterval = setInterval(spawnHeart, 1000);

        function winGame() {
            isGameOver = true;
            clearInterval(gameInterval);
            document.getElementById('unlock-letter-btn').classList.remove('hidden');
            removeAllHearts();
            alert("You caught 10 hearts! You win! 💌");
        }

        function endGame() {
            if (isGameOver) return; // Prevent multiple triggers
            isGameOver = true;
            clearInterval(gameInterval);
            removeAllHearts();
            alert("Oh no! You let a heart fall! 💔 Try again.");
            // Restart
            setTimeout(initMiniGame, 1000);
        }

        function removeAllHearts() {
            document.querySelectorAll('.falling-heart').forEach(h => h.remove());
        }
    }

    document.getElementById('unlock-letter-btn').addEventListener('click', () => {
        // Go to letter
        currentSectionIndex++;
        updateSection();
    });

    // --- Hold Button ---
    const holdBtn = document.getElementById('hold-btn');
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    let holdTimer;
    let holdStart;

    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    ['mousedown', 'touchstart'].forEach(evt =>
        holdBtn.addEventListener(evt, (e) => {
            e.preventDefault();
            holdStart = Date.now();
            holdTimer = requestAnimationFrame(checkHold);
        })
    );

    ['mouseup', 'mouseleave', 'touchend'].forEach(evt =>
        holdBtn.addEventListener(evt, () => {
            cancelAnimationFrame(holdTimer);
            setProgress(0);
        })
    );

    function checkHold() {
        const elapsed = Date.now() - holdStart;
        const percent = Math.min((elapsed / 5000) * 100, 100);
        setProgress(percent);

        if (elapsed < 5000) {
            holdTimer = requestAnimationFrame(checkHold);
        } else {
            // Success
            document.body.style.background = "#ffd1dc"; // Soft glow effect
            currentSectionIndex++;
            updateSection();
        }
    }

    // --- Final Page ---
    document.getElementById('last-click-btn').addEventListener('click', () => {
        document.getElementById('last-click-btn').classList.add('hidden');
        document.getElementById('final-content').classList.remove('hidden');
        // Trigger particles or more animations
    });

    document.getElementById('replay-btn').addEventListener('click', () => {
        currentSectionIndex = 0;
        updateSection();
    });

    // Helper: Confetti
    function createConfetti() {
        // Simple confetti implementation or placeholder
        for (let i = 0; i < 50; i++) {
            const el = document.createElement('div');
            el.innerHTML = '❤️';
            el.style.position = 'fixed';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-50px';
            el.style.fontSize = Math.random() * 20 + 20 + 'px';
            el.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
            document.body.appendChild(el);

            setTimeout(() => el.remove(), 3000);
        }

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fall {
                to { transform: translateY(100vh) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // --- 3D Effects Implementation ---

    // 1. Tilt Effect
    const tiltElements = document.querySelectorAll('.polaroid, .btn, .card, .brain-bubble, .slot');

    document.addEventListener('mousemove', (e) => {
        tiltElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if mouse is near the element (optimization)
            // Or just check if element is visible to avoid calculating for hidden sections
            if (el.offsetParent === null) return; // Hidden

            // Calculate rotation
            // Center is (rect.width / 2, rect.height / 2)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Mouse distance from center
            const mouseX = x - centerX;
            const mouseY = y - centerY;

            // Rotate based on mouse position
            // Max rotation deg
            const maxRot = 15;

            // Only apply if mouse is somewhat close or over the element for a "spotlight" effect
            // OR apply to all elements based on screen position (global tilt)
            // Let's go with Global Screen Tilt for a unified feel, but dampened

            /* 
               Alternative: Local Tilt (only when hovering). 
               Let's do Local Tilt for interactables as it's more fun.
            */

            if (
                e.clientX >= rect.left - 50 &&
                e.clientX <= rect.right + 50 &&
                e.clientY >= rect.top - 50 &&
                e.clientY <= rect.bottom + 50
            ) {
                const rotateX = (mouseY / centerY) * -maxRot; // Invert Y
                const rotateY = (mouseX / centerX) * maxRot;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            } else {
                // Reset
                el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
                // Restore inherent rotation for polaroids if established in CSS?
                // CSS has .polaroid { transform: rotate(-3deg); }
                // We need to preserve that.
                if (el.classList.contains('polaroid')) {
                    // Check if it's even or odd for the base rotation
                    // This is tricky because inline style overwrites CSS.
                    // Better approach: Wrap the content in a tilt-inner and rotate THAT, 
                    // or accumulate the rotation. 
                    // Simplified: Just reset to empty string to let CSS take over.
                    el.style.transform = "";
                }
            }
        });
    });

    // 2. Pastel Dream Animations (Bubbles & Sparkles)

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('dream-bubble');

        const size = Math.random() * 60 + 20; // 20px to 80px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}vw`;

        const duration = Math.random() * 5 + 10; // 10s to 15s
        bubble.style.animationDuration = `${duration}s`;

        document.body.appendChild(bubble);

        // Remove after animation
        setTimeout(() => {
            bubble.remove();
        }, duration * 1000);
    }

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        sparkle.style.left = `${Math.random() * 100}vw`;
        sparkle.style.top = `${Math.random() * 100}vh`;

        // Random scale variation
        const scale = Math.random() * 0.5 + 0.5;
        sparkle.style.transform = `scale(${scale})`; // Base scale, animation will override but we want variety? 
        // actually animation overrides transform, so let's set width/height or use variable
        // CSS animation uses scale(0) -> scale(1).

        // Random delay
        sparkle.style.animationDelay = `${Math.random() * 2}s`;

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 3000); // Match CSS animation duration
    }

    // Start generating
    setInterval(createBubble, 2000);
    setInterval(createSparkle, 500);

    // Initial population
    for (let i = 0; i < 5; i++) createBubble();
    for (let i = 0; i < 10; i++) createSparkle();

});

