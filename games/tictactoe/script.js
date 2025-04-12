const darkToggle = document.getElementById("darkModeToggle");
const startBtn = document.getElementById("startBtn");
const resetRoundBtn = document.getElementById("resetRound");
const resetGameBtn = document.getElementById("resetGame");
const saveGameBtn = document.getElementById("saveGame");
const resumeBtn = document.getElementById("resumeBtn");
const newGameBtn = document.getElementById("newGameBtn");

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const player1Label = document.getElementById("player1Label");
const player2Label = document.getElementById("player2Label");

const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");

const nameEntry = document.getElementById("name-entry");
const gameArea = document.getElementById("game-area");
const cells = document.querySelectorAll(".cell");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");


let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let player1Name = "Player 1";
let player2Name = "Player 2";
let score1 = 0;
let score2 = 0;
let round = 1;
let currentGameId = null;
let startingPlayer = "X"; // Alternates each round

function startGame() {
  player1Name = player1Input.value || "Player 1";
  player2Name = player2Input.value || "Player 2";
  player1Label.textContent = player1Name;
  player2Label.textContent = player2Name;
  nameEntry.style.display = "none";
  gameArea.style.display = "block";
  resumeBtn.style.display = "none";
  currentGameId = null;
  startingPlayer = "X";
  currentPlayer = startingPlayer;
  renderBoard();
}

function renderBoard() {
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    cell.onclick = () => handleMove(index);
  });
}

function handleMove(index) {
  if (board[index] !== "") return;
  board[index] = currentPlayer;
  renderBoard();
  const winner = checkWinner();
  if (winner) {
    setTimeout(() => {
      alert(`${winner === "X" ? player1Name : player2Name} wins!`);
      winner === "X" ? score1++ : score2++;
      updateScores();
      resetRound(true);
    }, 100);
  } else if (!board.includes("")) {
    setTimeout(() => {
      alert("It's a draw!");
      resetRound(true);
    }, 100);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWinner() {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function updateScores() {
  score1El.textContent = score1;
  score2El.textContent = score2;
}

function resetRound(advanceStarter = false) {
  board = ["", "", "", "", "", "", "", "", ""];
  if (advanceStarter) {
    startingPlayer = startingPlayer === "X" ? "O" : "X";
  }
  currentPlayer = startingPlayer;
  round++;
  renderBoard();
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  score1 = 0;
  score2 = 0;
  round = 1;
  startingPlayer = "X";
  currentPlayer = startingPlayer;
  updateScores();
  renderBoard();
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
    darkToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
  
  // On load, apply saved theme
  window.addEventListener("DOMContentLoaded", () => {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.body.classList.add("dark");
      darkToggle.textContent = "☀️ Light Mode";
    } else {
      darkToggle.textContent = "🌙 Dark Mode";
    }
  });

function saveGame() {
  const games = JSON.parse(localStorage.getItem("savedGames") || "[]");
  let game = games.find(g =>
    g.player1Name === player1Name &&
    g.player2Name === player2Name &&
    g.id === currentGameId
  );

  if (game) {
    game.score1 = score1;
    game.score2 = score2;
    game.board = [...board];
    game.currentPlayer = currentPlayer;
    game.round = round;
  } else {
    game = {
      id: Date.now(),
      player1Name,
      player2Name,
      score1,
      score2,
      board: [...board],
      currentPlayer,
      round
    };
    currentGameId = game.id;
    games.push(game);
  }

  localStorage.setItem("savedGames", JSON.stringify(games));
  loadHistory();
}

function loadGame(game) {
  currentGameId = game.id;
  player1Name = game.player1Name;
  player2Name = game.player2Name;
  score1 = game.score1;
  score2 = game.score2;
  board = game.board;
  currentPlayer = game.currentPlayer;
  round = game.round;

  player1Label.textContent = player1Name;
  player2Label.textContent = player2Name;
  updateScores();
  nameEntry.style.display = "none";
  gameArea.style.display = "block";
  renderBoard();
  resumeBtn.style.display = "block";
}

function loadHistory() {
    historyList.innerHTML = "";
    const games = JSON.parse(localStorage.getItem("savedGames") || "[]");
  
    games.reverse().forEach((game, index) => {
      const entry = document.createElement("div");
      entry.className = "history-entry";
  
      const text = document.createElement("span");
      text.textContent = `${game.player1Name} (${game.score1}) vs ${game.player2Name} (${game.score2})`;
      text.onclick = () => loadGame(game);
  
      const delBtn = document.createElement("button");
      delBtn.className = "delete-entry-btn";
      delBtn.innerHTML = "🗑️";
      delBtn.onclick = (e) => {
        e.stopPropagation(); // prevent triggering loadGame
        deleteGame(game.id);
      };
  
      entry.appendChild(text);
      entry.appendChild(delBtn);
      historyList.appendChild(entry);
    });
}

function deleteGame(id) {
    let games = JSON.parse(localStorage.getItem("savedGames") || "[]");
    games = games.filter(game => game.id !== id);
    localStorage.setItem("savedGames", JSON.stringify(games));
    loadHistory();
  }

darkToggle.onclick = toggleDarkMode;
startBtn.onclick = startGame;
resetRoundBtn.onclick = () => resetRound(false);
resetGameBtn.onclick = resetGame;
saveGameBtn.onclick = saveGame;
resumeBtn.onclick = () => {
  gameArea.style.display = "block";
  resumeBtn.style.display = "none";
};
newGameBtn.onclick = () => {
    currentGameId = null;
    score1 = 0;
    score2 = 0;
    round = 1;
    updateScores();
    board = ["", "", "", "", "", "", "", "", ""];
    startingPlayer = "X"; // Default to X for new game
    currentPlayer = startingPlayer;
    renderBoard();
    gameArea.style.display = "none";
    nameEntry.style.display = "block";
  };

  clearHistoryBtn.onclick = () => {
    if (confirm("Are you sure you want to clear all game history?")) {
      localStorage.removeItem("savedGames");
      loadHistory();
    }
  };

renderBoard();
loadHistory();
