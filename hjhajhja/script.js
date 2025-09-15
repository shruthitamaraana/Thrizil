document.addEventListener('DOMContentLoaded', () => {
    const onboardingModal = new bootstrap.Modal(document.getElementById('onboardingModal'));
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatWindow = document.querySelector('.chat-window');
    const confidenceProgress = document.querySelector('.confidence-progress');
    const microInteractionLayer = document.getElementById('microInteractionLayer');
    const popupMessage = document.getElementById('popup-message');

    // Onboarding Flow
    let hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
        onboardingModal.show();
    }

    document.getElementById('onboardingConsentBtn').addEventListener('click', () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        onboardingModal.hide();
    });

    // Keystroke Monitoring & Micro-interactions
    let lastKeypressTime = Date.now();
    let backspaceCount = 0;
    let confidenceScore = 50;
    let typingTimer;
    let isEncouragementsEnabled = true;
    let sensitivity = 50;
    let theme = 'butterflies';

    const encouragementMessages = {
        butterflies: ["You've got this!", "Take the leap 💕", "Just a gentle nudge...", "Let your words fly!"],
        stars: ["Shine on!", "You're a star!", "Don't dim your light.", "Make it sparkle!"],
        hearts: ["Say it with heart!", "Open up!", "Lead with love.", "Your words matter!"]
    };

    const celebratoryMessages = {
        lowConfidence: ["You did it!", "A small step, but a meaningful one!", "Great job pushing through!"],
        mediumConfidence: ["Message sent with confidence! ✨", "Another connection made!", "On a roll! Keep it up."],
        highConfidence: ["Effortless connection!", "Your words are flowing!", "That's how it's done!"]
    };

    function updateConfidence(scoreChange) {
        confidenceScore = Math.max(0, Math.min(100, confidenceScore + scoreChange));
        confidenceProgress.style.width = `${confidenceScore}%`;
    }

    function showEncouragementPopup() {
        if (!isEncouragementsEnabled) return;
        
        const messages = encouragementMessages[theme];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        popupMessage.textContent = randomMessage;
        
        // For a real website, you would use a Lottie animation here or a more complex CSS animation
        const animationElement = document.createElement('div');
        animationElement.classList.add('animation-effect', `${theme}-animation`);
        microInteractionLayer.appendChild(animationElement);
        
        popupMessage.classList.add('show');
        
        setTimeout(() => {
            popupMessage.classList.remove('show');
            animationElement.remove();
        }, 3000);
    }
    
    function showCelebratoryPopup() {
        let messages;
        if (confidenceScore <= 40) {
            messages = celebratoryMessages.lowConfidence;
        } else if (confidenceScore <= 80) {
            messages = celebratoryMessages.mediumConfidence;
        } else {
            messages = celebratoryMessages.highConfidence;
        }

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const celebrationPopup = document.createElement('div');
        celebrationPopup.classList.add('popup-message', 'show');
        celebrationPopup.textContent = randomMessage;
        microInteractionLayer.appendChild(celebrationPopup);
            
        // Clean up
        setTimeout(() => {
            celebrationPopup.remove();
        }, 2000);
    }

    messageInput.addEventListener('input', () => {
        // Auto-expand textarea
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
        
        const now = Date.now();
        const timeElapsed = now - lastKeypressTime;
        lastKeypressTime = now;
        
        // Heuristic for hesitation
        const hesitationThreshold = 500 + (100 - sensitivity) * 5; // Adjust based on sensitivity
        
        if (timeElapsed > hesitationThreshold) {
            updateConfidence(-5); // Penalize for long pauses
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                if (messageInput.value.length > 5) {
                     showEncouragementPopup();
                }
            }, 1000); // Trigger after a second of continued hesitation
        } else {
            updateConfidence(1); // Reward for steady typing
        }
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            backspaceCount++;
            if (backspaceCount > 2) {
                updateConfidence(-5); // Penalize for frequent backspaces
            }
        } else {
            backspaceCount = 0;
        }
    });
    
    // Add event listener for message sending
    sendBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            // Add message bubble to chat window
            const messageBubble = document.createElement('div');
            messageBubble.classList.add('message', 'self');
            messageBubble.innerHTML = `
                <div class="message-bubble">${messageText}</div>
            `;
            chatWindow.appendChild(messageBubble);

            // Animate confidence and celebrate
            updateConfidence(20);
            
            // Show a celebratory message based on the new confidence score
            showCelebratoryPopup();

            messageInput.value = '';
            messageInput.style.height = 'auto';
            chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
        }
    });

    // Settings Modal functionality
    document.getElementById('toggleEncouragements').addEventListener('change', (e) => {
        isEncouragementsEnabled = e.target.checked;
    });

    document.getElementById('sensitivitySlider').addEventListener('input', (e) => {
        sensitivity = e.target.value;
    });
    
    document.getElementById('themeSelector').addEventListener('change', (e) => {
        theme = e.target.value;
    });
});