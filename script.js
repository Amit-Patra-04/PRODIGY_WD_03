const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const vsPlayerButton = document.getElementById('vsPlayer');
const vsAIButton = document.getElementById('vsAI');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let isAI = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

function createBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-index', index);
        cellElement.innerText = cell;
        cellElement.addEventListener('click', handleCellClick);
        boardElement.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    event.target.innerText = currentPlayer;
    checkResult();

    if (isAI && gameActive) {
        currentPlayer = 'O';
        setTimeout(aiMove, 500); // AI moves after 0.5 sec
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') continue;
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            highlightWinningCells([a, b, c]); // Highlight winning cells
            break;
        }
    }

    if (roundWon) {
        statusElement.innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusElement.innerText = 'Game ended in a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.innerText = `It's ${currentPlayer}'s turn`;
}

function highlightWinningCells(cells) {
    cells.forEach(index => {
        document.querySelector(`[data-index='${index}']`).classList.add('win');
    });
}

function aiMove() {
    let bestMove = findBestMove();
    board[bestMove] = currentPlayer;
    createBoard();
    checkResult();
}

function findBestMove() {
    // 1. Check if AI can win
    for (let condition of winningConditions) {
        let [a, b, c] = condition;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
    }

    // 2. Check if AI needs to block the player
    for (let condition of winningConditions) {
        let [a, b, c] = condition;
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
    }

    // 3. Take center if available
    if (board[4] === '') return 4;

    // 4. Take a corner if available
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (board[corner] === '') return corner;
    }

    // 5. Take any remaining open space
    return board.findIndex(cell => cell === '');
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.innerText = `It's ${currentPlayer}'s turn`;
    createBoard();
}

function startVsPlayer() {
    isAI = false;
    resetGame();
}

function startVsAI() {
    isAI = true;
    resetGame();
}

vsPlayerButton.addEventListener('click', startVsPlayer);
vsAIButton.addEventListener('click', startVsAI);
resetButton.addEventListener('click', resetGame);

// Initialize the game
resetGame();
