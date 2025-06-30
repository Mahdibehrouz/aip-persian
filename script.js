// === Utility Functions === //
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// === DOM Elements === //
const ageScreen = $('#age-screen');
const gameScreen = $('#game-screen');
const ageForm = $('#ageForm');
const ageInput = $('#ageInput');
const gameTitle = $('#game-title');
const gameBoard = $('#gameBoard');
const movesDisplay = $('#moves');
const timerDisplay = $('#timer');
const modal = $('#discountModal');
const playAgainBtn = $('#playAgain');

// Game state
let config = {};
let emojis = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval;

// Emoji pools by difficulty for visual variation
const EMOJI_POOLS = {
  kids: ['🐶','🐱','🐭','🐰','🦊','🐻','🐼','🐨','🦁','🐸','🐵','🐔'],
  teens: ['⚽','🏀','🏈','⚾','🎾','🏐','🏓','🏸','🥊','🚴','🏄','🏆'],
  adults: ['🍕','🍔','🍣','🍜','🍩','🍦','🍷','🍺','☕','🥗','🌮','🥘'],
  seniors: ['🍎','🍊','🍌','🍇','🍉','🍓','🥝','🍍','🥥','🥭','🍑','🍐']
};

// Difficulty presets by age
function getConfigByAge(age) {
  if (age <= 12) {
    return {label: 'Easy', rows: 2, cols: 3, pool: EMOJI_POOLS.kids, revealDelay: 900};
  }
  if (age <= 18) {
    return {label: 'Medium', rows: 4, cols: 4, pool: EMOJI_POOLS.teens, revealDelay: 700};
  }
  if (age <= 59) {
    return {label: 'Hard', rows: 4, cols: 6, pool: EMOJI_POOLS.adults, revealDelay: 500};
  }
  // Seniors 60+
  return {label: 'Senior Friendly', rows: 3, cols: 4, pool: EMOJI_POOLS.seniors, revealDelay: 1000};
}

// === Game Functions === //
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(emoji) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.emoji = emoji;

  const inner = document.createElement('div');
  inner.classList.add('inner');

  const front = document.createElement('div');
  front.classList.add('card-face', 'front');
  front.textContent = emoji;

  const back = document.createElement('div');
  back.classList.add('card-face', 'back');
  back.textContent = '❓';

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

function handleCardClick(card) {
  if (card.classList.contains('flipped') || flippedCards.length === 2) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
      matchedPairs++;
      flippedCards = [];
      if (matchedPairs === emojis.length / 2) {
        winGame();
      }
    } else {
      // Not a match: flip back after delay
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
      }, config.revealDelay);
    }
  }
}

function buildBoard() {
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;

  // Select needed emojis and duplicate for pairs
  const neededPairs = (config.rows * config.cols) / 2;
  emojis = shuffle(config.pool).slice(0, neededPairs);
  const cardEmojis = shuffle([...emojis, ...emojis]);

  cardEmojis.forEach((emoji) => {
    gameBoard.appendChild(createCard(emoji));
  });
}

function resetGame() {
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  movesDisplay.textContent = 'Moves: 0';
  timerDisplay.textContent = 'Time: 0s';
  stopTimer();
  flippedCards = [];
}

function startGame(age) {
  config = getConfigByAge(age);
  gameTitle.textContent = `${config.label} Mode`;

  resetGame();
  buildBoard();
  startTimer();

  // Switch screens
  ageScreen.classList.remove('active');
  gameScreen.classList.add('active');
}

function winGame() {
  stopTimer();
  modal.classList.add('show');
  // Confetti burst
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function returnToAgeScreen() {
  modal.classList.remove('show');
  gameScreen.classList.remove('active');
  ageScreen.classList.add('active');
  ageInput.value = '';
}

// === Event Listeners === //
ageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const age = parseInt(ageInput.value, 10);
  if (isNaN(age) || age < 1) return;
  startGame(age);
});

playAgainBtn.addEventListener('click', () => {
  returnToAgeScreen();
});