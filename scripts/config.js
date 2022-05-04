/* Functions */
function handleOpenPlayerConfig(e) {
  currentPlayerEditing = +e.target.dataset.playerid;

  playerConfigOverlay.style.display = 'block';
  backdropElement.style.display = 'block';
}

function handleClosePlayerConfig() {
  playerConfigOverlay.style.display = 'none';
  backdropElement.style.display = 'none';

  configErrorsElement.textContent = '';
  formElement.firstElementChild.classList.remove('error');
  formElement.firstElementChild.querySelector('#playername').value = '';
}

function handlePlayerNameFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const enteredPlayerName = formData.get('playername').trim();

  if (!enteredPlayerName) {
    e.target.firstElementChild.classList.add('error');
    configErrorsElement.textContent = 'Please enter a valid name!';
    return;
  }

  players[currentPlayerEditing - 1].name = enteredPlayerName;
  const updatingPlayerData = document.getElementById(
    `player-${currentPlayerEditing}-data`
  );
  updatingPlayerData.children[1].textContent = enteredPlayerName;

  handleClosePlayerConfig();
}
