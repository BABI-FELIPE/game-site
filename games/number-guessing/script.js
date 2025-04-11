let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let guessesPerGame = JSON.parse(localStorage.getItem("guessesPerGame")) || [];

const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attempts");
const playAgain = document.getElementById("playAgain");
const guessHistory = document.getElementById("guessHistory");
const scoreDisplay = document.getElementById("score");

// Clear history button
const clearHistoryButton = document.getElementById("clearHistory");

// Load the guess history into the scoreboard
updateScoreboard();

// Submit guess event listener
submitGuess.addEventListener("click", handleGuess);

// Allow pressing Enter to submit the guess
guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitGuess.click();
  }
});

function handleGuess() {
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = "⛔ Enter a valid number between 1 and 100.";
    return;
  }

  attempts++;

  const listItem = document.createElement("li");

  if (guess === secretNumber) {
    listItem.textContent = `${guess} ✅ Correct!`;
    feedback.textContent = `🎉 Correct! The number was ${secretNumber}.`;
    attemptsDisplay.textContent = `Guessed in ${attempts} attempt(s).`;

    guessesPerGame.push(attempts); // Store guesses count for this game
    localStorage.setItem("guessesPerGame", JSON.stringify(guessesPerGame)); // Save to localStorage
    updateScoreboard(); // Update the scoreboard display

    submitGuess.disabled = true;
    guessInput.disabled = true;
    playAgain.style.display = "inline-block";
  } else if (guess < secretNumber) {
    listItem.textContent = `${guess} ⬇️ Too low`;
    feedback.textContent = "📉 Too low. Try again!";
  } else {
    listItem.textContent = `${guess} ⬆️ Too high`;
    feedback.textContent = "📈 Too high. Try again!";
  }

  guessHistory.appendChild(listItem);

  guessInput.value = "";
  guessInput.focus();
}

function updateScoreboard() {
  const scoreboard = document.getElementById("scoreList");
  scoreboard.innerHTML = ''; // Clear previous scoreboard entries

  guessesPerGame.forEach((guessCount, index) => {
    const scoreItem = document.createElement("li");
    scoreItem.textContent = `Game ${index + 1}: ${guessCount} guess(es)`;
    scoreboard.appendChild(scoreItem);
  });
}

// Clear History functionality
clearHistoryButton.addEventListener("click", () => {
  // Clear the history from localStorage
  localStorage.removeItem("guessesPerGame");

  // Clear the scoreboard display
  guessesPerGame = [];
  updateScoreboard();
});

playAgain.addEventListener("click", () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  feedback.textContent = "";
  attemptsDisplay.textContent = "";
  guessInput.disabled = false;
  submitGuess.disabled = false;
  guessInput.value = "";
  guessHistory.innerHTML = "";
  playAgain.style.display = "none";
  guessInput.focus();
});