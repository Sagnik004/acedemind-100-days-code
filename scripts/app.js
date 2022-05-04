/* Variables */
const gameData = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
let currentPlayerEditing = 0;
let activePlayer = 0;
const players = [
  {
    name: '',
    symbol: 'X',
  },
  {
    name: '',
    symbol: 'O',
  },
];
let currentRound = 1;
let isGameOver = false;

/* DOM Elements */
const playerConfigOverlay = document.getElementById('config-overlay');
const backdropElement = document.getElementById('backdrop');
const formElement = document.querySelector('form');
const configErrorsElement = document.getElementById('config-errors');
const activeGameAreaElement = document.getElementById('active-game');
const activePlayerNameElement = document.getElementById('active-player-name');
const gameOverElement = document.getElementById('game-over');

const editPlayer1Btn = document.getElementById('edit-player-1-btn');
const editPlayer2Btn = document.getElementById('edit-player-2-btn');
const cancelConfigBtn = document.getElementById('cancel-config-btn');
const startNewGameBtn = document.getElementById('start-game-btn');
const gameBoard = document.querySelector('#game-board');

/* Event Listeners */
cancelConfigBtn.addEventListener('click', handleClosePlayerConfig);
backdropElement.addEventListener('click', handleClosePlayerConfig);

editPlayer1Btn.addEventListener('click', handleOpenPlayerConfig);
editPlayer2Btn.addEventListener('click', handleOpenPlayerConfig);

formElement.addEventListener('submit', handlePlayerNameFormSubmit);

startNewGameBtn.addEventListener('click', handleStartNewGame);

gameBoard.addEventListener('click', handleSelectGameField);
