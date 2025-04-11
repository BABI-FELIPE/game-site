const startBtn = document.getElementById("startBtn");
const nameEntry = document.getElementById("name-entry");
const gameArea = document.getElementById("game-area");

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");

const player1Label = document.getElementById("player1Label");
const player2Label = document.getElementById("player2Label");
const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");

const cells = document.querySelectorAll(".cell");
const resetRoundBtn = document.getElementById("resetRound");
const resetGameBtn = document.getElementById("resetGame");

let board = Array(9).fill("");
let gameOver = false;

let player1Name = "Player 1";
let player2Name = "Player 2";

let player1Symbol = "X";
let player2Symbol = "O";

let currentPlayer = "X";

let player1Score = 0;
let player2Score = 0;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function updateScore(winnerSymbol) {
  if (player1Symbol === winnerSymbol) {
    player1Score++;
  } else {
    player2Score++;
  }

  score1Display.textContent = player1Score;
  score2Display.textContent = player2Score;
}

function getCurrentPlayerName() {
  return currentPlayer === player1Symbol ? player1Name : player2Name;
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      const winnerName = getCurrentPlayerName();
      alert(`${winnerName} wins!`);
      updateScore(currentPlayer);
      setTimeout(nextGame, 300);
      return;
    }
  }

  if (!board.includes("")) {
    gameOver = true;
    alert("It's a draw!");
    setTimeout(nextGame, 300);
  }
}

function handleClick(e) {
  const index = e.target.getAttribute("data-index");
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  checkWinner();

  if (!gameOver) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateActivePlayerHighlight();
  }
}

function resetBoard() {
  board = Array(9).fill("");
  gameOver = false;
  cells.forEach((cell) => (cell.textContent = ""));
  currentPlayer = "X";
}

function updateActivePlayerHighlight() {
  const player1Box = player1Label.parentElement;
  const player2Box = player2Label.parentElement;

  if (currentPlayer === player1Symbol) {
    player1Box.classList.add("active");
    player2Box.classList.remove("active");
  } else {
    player2Box.classList.add("active");
    player1Box.classList.remove("active");
  }
}

function nextGame() {
  // Flip symbols between players
  [player1Symbol, player2Symbol] = [player2Symbol, player1Symbol];

  // Update labels
  player1Label.textContent = `${player1Name} (${player1Symbol})`;
  player2Label.textContent = `${player2Name} (${player2Symbol})`;

  resetBoard();
  updateActivePlayerHighlight();
}

function startGame() {
  player1Name = player1Input.value.trim() || "Player 1";
  player2Name = player2Input.value.trim() || "Player 2";

  player1Symbol = "X";
  player2Symbol = "O";

  player1Score = 0;
  player2Score = 0;

  player1Label.textContent = `${player1Name} (${player1Symbol})`;
  player2Label.textContent = `${player2Name} (${player2Symbol})`;

  score1Display.textContent = "0";
  score2Display.textContent = "0";

  nameEntry.style.display = "none";
  gameArea.style.display = "block";

  resetBoard();
  updateActivePlayerHighlight();
}

// Button Events
startBtn.addEventListener("click", startGame);
resetRoundBtn.addEventListener("click", () => {
  resetBoard();
  updateActivePlayerHighlight();
});
resetGameBtn.addEventListener("click", () => {
  nameEntry.style.display = "block";
  gameArea.style.display = "none";

  player1Input.value = "";
  player2Input.value = "";

  player1Score = 0;
  player2Score = 0;

  score1Display.textContent = "0";
  score2Display.textContent = "0";

  player1Label.textContent = "Player 1";
  player2Label.textContent = "Player 2";

  board = Array(9).fill("");
  cells.forEach((cell) => (cell.textContent = ""));

  gameOver = false;
});

cells.forEach((cell) => cell.addEventListener("click", handleClick));

const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});