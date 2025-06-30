// Game Configuration and State Management
class GameManager {
    constructor() {
        this.currentAge = null;
        this.currentGameType = null;
        this.gameConfig = {};
        this.gameState = {
            score: 0,
            level: 1,
            startTime: null,
            endTime: null,
            matches: 0,
            attempts: 0
        };
        this.init();
    }

    init() {
        this.createParticles();
        this.setupEventListeners();
        this.generateDiscountCode();
    }

    // Particle System for Background
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Age group selection
        document.querySelectorAll('.age-group-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const age = e.currentTarget.dataset.age;
                this.selectAgeGroup(age);
            });
        });

        // Navigation buttons
        document.getElementById('exit-game').addEventListener('click', () => {
            this.showScreen('age-selection');
        });

        document.getElementById('play-again').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });

        document.getElementById('change-age').addEventListener('click', () => {
            this.showScreen('age-selection');
        });

        document.getElementById('copy-code').addEventListener('click', () => {
            this.copyDiscountCode();
        });

        // Game-specific event listeners will be added dynamically
    }

    // Age Group Selection and Game Configuration
    selectAgeGroup(age) {
        this.currentAge = age;
        this.configureGameForAge(age);
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            this.startGame();
        }, 2000);
    }

    configureGameForAge(age) {
        const configs = {
            child: {
                gameType: 'memory',
                gridSize: 4, // 4x4 grid
                cardTypes: ['🐶', '🐱', '🐰', '🐸', '🦋', '🌟', '🎈', '🍎'],
                timeBonus: 10,
                scoreMultiplier: 100,
                instructions: 'Find matching pairs of animals and objects!'
            },
            teen: {
                gameType: 'pattern',
                sequenceLength: 4,
                colors: ['#e53e3e', '#3182ce', '#38a169', '#d69e2e', '#805ad5'],
                timeBonus: 15,
                scoreMultiplier: 150,
                instructions: 'Watch the pattern and repeat it correctly!'
            },
            adult: {
                gameType: 'math',
                difficulty: 'advanced',
                operations: ['+', '-', '*', '/'],
                maxNumber: 50,
                timeBonus: 20,
                scoreMultiplier: 200,
                instructions: 'Solve math problems quickly and accurately!'
            },
            senior: {
                gameType: 'word',
                wordLength: 5,
                displayTime: 4000,
                categories: ['nature', 'family', 'hobbies'],
                timeBonus: 25,
                scoreMultiplier: 120,
                instructions: 'Remember the words and type them back!'
            }
        };

        this.gameConfig = configs[age];
        this.currentGameType = this.gameConfig.gameType;
    }

    // Screen Management
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showLoading() {
        document.getElementById('loading').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading').classList.remove('active');
    }

    // Game Management
    startGame() {
        this.resetGameState();
        this.showScreen('game-screen');
        this.setupGameUI();
        this.startTimer();
        
        switch (this.currentGameType) {
            case 'memory':
                this.startMemoryGame();
                break;
            case 'pattern':
                this.startPatternGame();
                break;
            case 'math':
                this.startMathGame();
                break;
            case 'word':
                this.startWordGame();
                break;
        }
    }

    resetGameState() {
        this.gameState = {
            score: 0,
            level: 1,
            startTime: Date.now(),
            endTime: null,
            matches: 0,
            attempts: 0
        };
    }

    resetGame() {
        this.resetGameState();
        this.hideAllGames();
    }

    setupGameUI() {
        document.getElementById('game-title-header').textContent = this.getGameTitle();
        document.getElementById('game-instructions').querySelector('p').textContent = this.gameConfig.instructions;
        this.updateUI();
    }

    getGameTitle() {
        const titles = {
            memory: 'Memory Challenge',
            pattern: 'Pattern Recognition',
            math: 'Math Master',
            word: 'Word Memory'
        };
        return titles[this.currentGameType];
    }

    hideAllGames() {
        ['memory-game', 'pattern-game', 'math-game', 'word-game'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
    }

    updateUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('level').textContent = this.gameState.level;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.gameState.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.gameState.endTime = Date.now();
    }

    // Memory Game Implementation
    startMemoryGame() {
        this.hideAllGames();
        document.getElementById('memory-game').classList.remove('hidden');
        this.createMemoryGrid();
    }

    createMemoryGrid() {
        const grid = document.getElementById('game-grid');
        grid.innerHTML = '';
        
        const { gridSize, cardTypes } = this.gameConfig;
        const totalCards = gridSize * gridSize;
        const pairsNeeded = totalCards / 2;
        
        // Create card pairs
        const cards = [];
        for (let i = 0; i < pairsNeeded; i++) {
            const cardType = cardTypes[i % cardTypes.length];
            cards.push(cardType, cardType);
        }
        
        // Shuffle cards
        this.shuffleArray(cards);
        
        // Set grid layout
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        // Create card elements
        cards.forEach((cardType, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.type = cardType;
            card.dataset.index = index;
            card.addEventListener('click', (e) => this.handleMemoryCardClick(e));
            grid.appendChild(card);
        });
        
        this.memoryGame = {
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: pairsNeeded
        };
    }

    handleMemoryCardClick(e) {
        const card = e.currentTarget;
        
        if (card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = card.dataset.type;
        this.memoryGame.flippedCards.push(card);
        
        if (this.memoryGame.flippedCards.length === 2) {
            this.gameState.attempts++;
            setTimeout(() => this.checkMemoryMatch(), 800);
        }
    }

    checkMemoryMatch() {
        const [card1, card2] = this.memoryGame.flippedCards;
        
        if (card1.dataset.type === card2.dataset.type) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.memoryGame.matchedPairs++;
            this.gameState.matches++;
            this.gameState.score += this.gameConfig.scoreMultiplier;
            this.updateUI();
            
            if (this.memoryGame.matchedPairs === this.memoryGame.totalPairs) {
                this.completeLevel();
            }
        } else {
            // No match
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }
        
        this.memoryGame.flippedCards = [];
    }

    // Pattern Game Implementation
    startPatternGame() {
        this.hideAllGames();
        document.getElementById('pattern-game').classList.remove('hidden');
        this.createPatternGame();
    }

    createPatternGame() {
        this.patternGame = {
            sequence: [],
            playerSequence: [],
            currentStep: 0,
            isPlaying: false,
            level: 1
        };
        
        this.createPatternButtons();
        this.generateNewPattern();
    }

    createPatternButtons() {
        const inputContainer = document.getElementById('pattern-input');
        inputContainer.innerHTML = '';
        
        this.gameConfig.colors.forEach((color, index) => {
            const button = document.createElement('button');
            button.className = 'pattern-button';
            button.style.backgroundColor = color;
            button.dataset.color = color;
            button.dataset.index = index;
            button.addEventListener('click', (e) => this.handlePatternButtonClick(e));
            inputContainer.appendChild(button);
        });
        
        const submitBtn = document.getElementById('pattern-submit');
        submitBtn.addEventListener('click', () => this.submitPattern());
    }

    generateNewPattern() {
        const length = this.gameConfig.sequenceLength + this.gameState.level - 1;
        this.patternGame.sequence = [];
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * this.gameConfig.colors.length);
            this.patternGame.sequence.push(randomIndex);
        }
        
        this.showPattern();
    }

    showPattern() {
        const displayContainer = document.getElementById('pattern-display');
        displayContainer.innerHTML = '';
        this.patternGame.isPlaying = true;
        
        this.patternGame.sequence.forEach((colorIndex, step) => {
            setTimeout(() => {
                const button = document.createElement('div');
                button.className = 'pattern-button active';
                button.style.backgroundColor = this.gameConfig.colors[colorIndex];
                displayContainer.appendChild(button);
                
                if (step === this.patternGame.sequence.length - 1) {
                    setTimeout(() => {
                        displayContainer.innerHTML = '<p>Now repeat the pattern!</p>';
                        this.patternGame.isPlaying = false;
                        this.patternGame.playerSequence = [];
                    }, 1000);
                }
            }, step * 600);
        });
    }

    handlePatternButtonClick(e) {
        if (this.patternGame.isPlaying) return;
        
        const button = e.currentTarget;
        const colorIndex = parseInt(button.dataset.index);
        
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 200);
        
        this.patternGame.playerSequence.push(colorIndex);
    }

    submitPattern() {
        if (this.patternGame.isPlaying) return;
        
        const correct = this.arraysEqual(this.patternGame.sequence, this.patternGame.playerSequence);
        
        if (correct) {
            this.gameState.score += this.gameConfig.scoreMultiplier;
            this.updateUI();
            this.completeLevel();
        } else {
            this.gameState.attempts++;
            this.showPatternFeedback(false);
            setTimeout(() => this.generateNewPattern(), 2000);
        }
    }

    showPatternFeedback(correct) {
        const displayContainer = document.getElementById('pattern-display');
        displayContainer.innerHTML = `<p style="color: ${correct ? '#48bb78' : '#f56565'}; font-size: 1.5rem;">
            ${correct ? 'Correct!' : 'Try again!'}
        </p>`;
    }

    // Math Game Implementation
    startMathGame() {
        this.hideAllGames();
        document.getElementById('math-game').classList.remove('hidden');
        this.createMathQuestion();
    }

    createMathQuestion() {
        const { operations, maxNumber } = this.gameConfig;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer, question;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * maxNumber);
                num2 = Math.floor(Math.random() * maxNumber);
                answer = num1 + num2;
                question = `${num1} + ${num2}`;
                break;
            case '-':
                num1 = Math.floor(Math.random() * maxNumber) + maxNumber/2;
                num2 = Math.floor(Math.random() * (num1/2));
                answer = num1 - num2;
                question = `${num1} - ${num2}`;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                question = `${num1} × ${num2}`;
                break;
            case '/':
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 20) + 1;
                num1 = num2 * answer;
                question = `${num1} ÷ ${num2}`;
                break;
        }
        
        document.getElementById('math-question').textContent = `${question} = ?`;
        
        // Generate options
        const options = [answer];
        while (options.length < 4) {
            const wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer !== answer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        this.shuffleArray(options);
        this.createMathOptions(options, answer);
        
        this.mathGame = { correctAnswer: answer };
    }

    createMathOptions(options, correctAnswer) {
        const container = document.getElementById('math-options');
        container.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'math-option';
            button.textContent = option;
            button.addEventListener('click', (e) => this.handleMathAnswer(e, option, correctAnswer));
            container.appendChild(button);
        });
    }

    handleMathAnswer(e, selectedAnswer, correctAnswer) {
        const button = e.currentTarget;
        this.gameState.attempts++;
        
        if (selectedAnswer === correctAnswer) {
            button.classList.add('correct');
            this.gameState.score += this.gameConfig.scoreMultiplier;
            this.gameState.matches++;
            this.updateUI();
            
            setTimeout(() => {
                if (this.gameState.matches >= 10) {
                    this.completeLevel();
                } else {
                    this.createMathQuestion();
                }
            }, 1500);
        } else {
            button.classList.add('incorrect');
            document.querySelectorAll('.math-option').forEach(btn => {
                if (parseInt(btn.textContent) === correctAnswer) {
                    btn.classList.add('correct');
                }
                btn.style.pointerEvents = 'none';
            });
            
            setTimeout(() => this.createMathQuestion(), 2000);
        }
    }

    // Word Game Implementation
    startWordGame() {
        this.hideAllGames();
        document.getElementById('word-game').classList.remove('hidden');
        this.createWordChallenge();
    }

    createWordChallenge() {
        const words = this.getWordsForCategory();
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        this.wordGame = {
            currentWord: randomWord,
            wordsCompleted: 0
        };
        
        this.displayWord(randomWord);
        this.setupWordInput();
    }

    getWordsForCategory() {
        const wordLists = {
            nature: ['FOREST', 'OCEAN', 'MOUNTAIN', 'FLOWER', 'SUNSET', 'RAINBOW', 'RIVER', 'GARDEN'],
            family: ['MOTHER', 'FATHER', 'SISTER', 'BROTHER', 'FAMILY', 'CHILDREN', 'PARENTS', 'HOME'],
            hobbies: ['READING', 'COOKING', 'MUSIC', 'PAINTING', 'TRAVEL', 'SPORTS', 'GAMES', 'DANCE']
        };
        
        const category = this.gameConfig.categories[Math.floor(Math.random() * this.gameConfig.categories.length)];
        return wordLists[category];
    }

    displayWord(word) {
        const display = document.getElementById('word-display');
        display.textContent = word;
        
        setTimeout(() => {
            display.textContent = 'Type the word you saw...';
        }, this.gameConfig.displayTime);
    }

    setupWordInput() {
        const input = document.getElementById('word-input');
        const submitBtn = document.getElementById('word-submit');
        
        input.value = '';
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitWord();
            }
        });
        
        submitBtn.addEventListener('click', () => this.submitWord());
    }

    submitWord() {
        const input = document.getElementById('word-input');
        const userWord = input.value.toUpperCase().trim();
        
        this.gameState.attempts++;
        
        if (userWord === this.wordGame.currentWord) {
            this.gameState.score += this.gameConfig.scoreMultiplier;
            this.gameState.matches++;
            this.wordGame.wordsCompleted++;
            this.updateUI();
            
            if (this.wordGame.wordsCompleted >= 8) {
                this.completeLevel();
            } else {
                this.showWordFeedback(true);
                setTimeout(() => this.createWordChallenge(), 2000);
            }
        } else {
            this.showWordFeedback(false);
            setTimeout(() => this.createWordChallenge(), 2000);
        }
    }

    showWordFeedback(correct) {
        const display = document.getElementById('word-display');
        display.innerHTML = `<p style="color: ${correct ? '#48bb78' : '#f56565'}; font-size: 2rem;">
            ${correct ? 'Correct!' : `The word was: ${this.wordGame.currentWord}`}
        </p>`;
    }

    // Level Management
    completeLevel() {
        this.gameState.level++;
        this.gameState.score += this.gameConfig.timeBonus * this.gameState.level;
        
        if (this.gameState.level <= 3) {
            this.updateUI();
            this.showLevelComplete();
            setTimeout(() => {
                this.adjustDifficultyForNextLevel();
                this.startNextLevel();
            }, 3000);
        } else {
            this.endGame();
        }
    }

    showLevelComplete() {
        const gameArea = document.querySelector('.game-area');
        const levelMessage = document.createElement('div');
        levelMessage.className = 'level-complete-message';
        levelMessage.innerHTML = `
            <div style="text-align: center; padding: 40px; background: rgba(72, 187, 120, 0.1); border-radius: 16px; margin: 20px;">
                <h3 style="color: #48bb78; font-size: 2rem; margin-bottom: 10px;">Level ${this.gameState.level - 1} Complete!</h3>
                <p style="font-size: 1.2rem; color: #2d3748;">Preparing next challenge...</p>
            </div>
        `;
        
        gameArea.appendChild(levelMessage);
        
        setTimeout(() => {
            if (levelMessage.parentNode) {
                levelMessage.parentNode.removeChild(levelMessage);
            }
        }, 3000);
    }

    adjustDifficultyForNextLevel() {
        switch (this.currentGameType) {
            case 'memory':
                // Increase grid size slightly
                if (this.gameConfig.gridSize < 6) {
                    this.gameConfig.gridSize += 2;
                }
                break;
            case 'pattern':
                // Increase sequence length
                this.gameConfig.sequenceLength++;
                break;
            case 'math':
                // Increase max number
                this.gameConfig.maxNumber += 20;
                break;
            case 'word':
                // Decrease display time
                if (this.gameConfig.displayTime > 2000) {
                    this.gameConfig.displayTime -= 500;
                }
                break;
        }
    }

    startNextLevel() {
        switch (this.currentGameType) {
            case 'memory':
                this.startMemoryGame();
                break;
            case 'pattern':
                this.generateNewPattern();
                break;
            case 'math':
                this.createMathQuestion();
                break;
            case 'word':
                this.createWordChallenge();
                break;
        }
    }

    // Game Completion
    endGame() {
        this.stopTimer();
        this.showResults();
    }

    showResults() {
        this.showScreen('results-screen');
        
        const timeTaken = this.gameState.endTime - this.gameState.startTime;
        const minutes = Math.floor(timeTaken / 60000);
        const seconds = Math.floor((timeTaken % 60000) / 1000);
        
        document.getElementById('final-score').textContent = this.gameState.score;
        document.getElementById('final-time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('final-level').textContent = this.gameState.level - 1;
        
        // Customize message based on performance
        const accuracy = this.gameState.matches / Math.max(this.gameState.attempts, 1);
        let message = "Well done!";
        
        if (accuracy > 0.8) {
            message = "Outstanding performance!";
        } else if (accuracy > 0.6) {
            message = "Great job!";
        } else if (accuracy > 0.4) {
            message = "Good effort!";
        }
        
        document.getElementById('results-message').textContent = message;
    }

    // Discount Code Management
    generateDiscountCode() {
        const codes = ['GAME10OFF', 'PLAY10', 'MIND10', 'CHALLENGE10', 'BRAIN10'];
        this.discountCode = codes[Math.floor(Math.random() * codes.length)];
        document.getElementById('discount-code').textContent = this.discountCode;
    }

    copyDiscountCode() {
        navigator.clipboard.writeText(this.discountCode).then(() => {
            const button = document.getElementById('copy-code');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.style.background = 'rgba(72, 187, 120, 0.3)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'rgba(255, 255, 255, 0.2)';
            }, 2000);
        });
    }

    // Utility Methods
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    arraysEqual(arr1, arr2) {
        return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});

// Add some additional visual effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('age-group-card')) {
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('age-group-card')) {
            e.target.style.transform = 'translateY(0) scale(1)';
        }
    });

    // Add ripple effect to buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
            const ripple = document.createElement('span');
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            e.target.style.position = 'relative';
            e.target.style.overflow = 'hidden';
            e.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});