const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cells = Array.from(document.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const scoreDrawEl = document.getElementById("score-draw");
const scores = { X: 0, O: 0, draws: 0 };
let board = Array(9).fill("");
let current = "X";
let locked = false;
function winner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
}
function render() {
  cells.forEach((cell, index) => {
    const mark = board[index];
    cell.textContent = mark;
    cell.classList.toggle("x", mark === "X");
    cell.classList.toggle("o", mark === "O");
    cell.disabled = locked || Boolean(mark);
  });
}
function setStatus(text) {
  statusEl.textContent = text;
}
function endGame(result) {
  locked = true;
  cells.forEach((cell) => {
    cell.disabled = true;
  });
  if (result === "draw") {
    scores.draws += 1;
    scoreDrawEl.textContent = String(scores.draws);
    setStatus("It's a draw");
    return;
  }
  result.line.forEach((index) => cells[index].classList.add("win"));
  scores[result.player] += 1;
  if (result.player === "X") {
    scoreXEl.textContent = String(scores.X);
  } else {
    scoreOEl.textContent = String(scores.O);
  }
  setStatus(`${result.player} wins`);
}
function play(index) {
  if (locked || board[index]) return;
  board[index] = current;
  const result = winner();
  if (result) {
    render();
    endGame(result);
    return;
  }
  if (board.every(Boolean)) {
    render();
    endGame("draw");
    return;
  }
  current = current === "X" ? "O" : "X";
  render();
  setStatus(`${current}'s turn`);
}
function resetBoard() {
  board = Array(9).fill("");
  current = "X";
  locked = false;
  cells.forEach((cell) => cell.classList.remove("win"));
  render();
  setStatus("X starts the game");
}
cells.forEach((cell) => {
  cell.addEventListener("click", () => play(Number(cell.dataset.index)));
});
resetBtn.addEventListener("click", resetBoard);
render();
