/* Functions */
function resetGameStatus() {
  activePlayer = 0;
  currentRound = 1;
  isGameOver = false;

  gameOverElement.firstElementChild.innerHTML =
    'You won! <span id="winner-name">PLAYER NAME</span>';
  gameOverElement.style.display = 'none';

  let gameBoardIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gameData[i][j] = 0;

      const gameBoardCell = gameBoard.children[gameBoardIndex];
      gameBoardCell.textContent = '';
      gameBoardCell.classList.remove('disabled');
      gameBoardIndex++;
    }
  }
}

function handleStartNewGame() {
  if (players[0].name === '' || players[1].name === '') {
    alert('Please edit and set both of the players name!');
    return;
  }

  resetGameStatus();
  activePlayerNameElement.textContent = players[activePlayer].name;
  activeGameAreaElement.style.display = 'block';
}

function switchActivePlayer() {
  activePlayer = activePlayer === 0 ? 1 : 0;
  activePlayerNameElement.textContent = players[activePlayer].name;
}

function handleSelectGameField(e) {
  if (e.target.tagName !== 'LI' || isGameOver) {
    return;
  }

  const selectedField = e.target;
  const row = selectedField.dataset.row - 1; // Minus will do implicit type conversion
  const col = selectedField.dataset.col - 1;

  if (gameData[row][col] !== 0) {
    alert('Please select an empty cell!');
    return;
  }

  selectedField.textContent = players[activePlayer].symbol;
  selectedField.classList.add('disabled');

  gameData[row][col] = activePlayer + 1;

  const winnerId = checkForGameOver();
  if (winnerId !== 0) {
    endGame(winnerId);
  }

  currentRound++;
  switchActivePlayer();
}

function checkForGameOver() {
  // Checks rows for equality
  for (let i = 0; i < 3; i++) {
    if (
      gameData[i][0] > 0 &&
      gameData[i][0] === gameData[i][1] &&
      gameData[i][1] === gameData[i][2]
    ) {
      return gameData[i][0];
    }
  }

  // Checks cols for equality
  for (let i = 0; i < 3; i++) {
    if (
      gameData[0][i] > 0 &&
      gameData[0][i] === gameData[1][i] &&
      gameData[1][i] === gameData[2][i]
    ) {
      return gameData[0][i];
    }
  }

  // Check top-left to bottom-right diagonal cells for equality
  if (
    gameData[0][0] > 0 &&
    gameData[0][0] === gameData[1][1] &&
    gameData[1][1] === gameData[2][2]
  ) {
    return gameData[0][0];
  }

  // Check bottom-left to top-right diagonal cells for equality
  if (
    gameData[2][0] > 0 &&
    gameData[2][0] === gameData[1][1] &&
    gameData[1][1] === gameData[0][2]
  ) {
    return gameData[2][0];
  }

  if (currentRound === 9) {
    return -1;
  }

  return 0;
}

function endGame(winnerId) {
  isGameOver = true;
  gameOverElement.style.display = 'block';

  if (winnerId > 0) {
    const winnerName = players[winnerId - 1].name;
    gameOverElement.firstElementChild.firstElementChild.textContent =
      winnerName;
  } else {
    gameOverElement.firstElementChild.textContent = `It's a draw!`;
  }
}
