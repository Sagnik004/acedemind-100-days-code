/* DOM Elements */
const productNameInputElement = document.getElementById("product-name");
const remainingCharsElement = document.getElementById("remaining-chars");

/* Constants */
const MAX_ALLOWED_CHARS = productNameInputElement.maxLength;

/* Functions */
function displayRemaningChars(count) {
  remainingCharsElement.textContent = count;
  if (count <= 10) {
    productNameInputElement.classList.add("warning");
    remainingCharsElement.classList.add("warning");
  } else {
    productNameInputElement.classList.remove("warning");
    remainingCharsElement.classList.remove("warning");
  }
}

function handleInputEvent(e) {
  const inputLength = e.target.value.length;
  const charsLeft = MAX_ALLOWED_CHARS - inputLength;
  displayRemaningChars(charsLeft);
}

/* Event Listeners */
productNameInputElement.addEventListener("input", handleInputEvent);
