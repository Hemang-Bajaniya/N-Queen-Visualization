const nob = document.getElementById("nob");
const nbox = document.getElementById("nbox");
const board = document.getElementById("board");
const frm = document.getElementById("frm");
const delayMs = 500; // Delay in milliseconds for each step

// Create a container to display the time taken
const timeDisplay = document.createElement("div");
timeDisplay.classList.add("text-center", "mt-3", "text-lg", "text-gray-700", "bg-white", "rounded-lg", "w-fit", "mx-auto", "px-5", "py-1");
timeDisplay.textContent = `Time taken to solve ${nob.value}-queen`;
document.body.appendChild(timeDisplay);

frm.addEventListener("submit", (e) => {
    e.preventDefault();
    // timeDisplay.textContent = `Time taken to solve  ${nob.value}-queen`;
    // timeDisplay.innerHTML = `<i class="fa - solid fa - clock"></i>`;
    timeDisplay.innerHTML = `<i class="fa-solid fa-clock text-green-500"></i>`;
    solveNQueens();
});

// Delay function to control the visualization speed
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateBoard(boardarr = []) {
    const n = Number(nob.value);
    nbox.innerHTML = n;
    board.innerHTML = ""; // Clear existing board content
    board.style.gridTemplateRows = `repeat(${n}, 50px)`;
    board.style.gridTemplateColumns = `repeat(${n}, 50px)`;
    board.classList.add("grid");

    // Create grid cells with alternating colors
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const cell = document.createElement("span");
            cell.classList.add("board-box", (row + col) % 2 === 0 ? "light-cell" : "dark-cell", "text-xl");
            cell.id = `${row}-${col}`;

            // Place a queen icon if the solution array contains a queen at this position
            if (boardarr.length !== 0 && boardarr[row][col]) {
                cell.innerHTML = `<i class="fa-solid fa-chess-queen"></i>`;
            }
            board.appendChild(cell);
        }
    }
}

function createBoard(n) {
    return Array.from({ length: n }, () => Array(n).fill(0));
}

function canPlace(row, col, placedQueens) {
    for (const [r, c] of placedQueens) {
        if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
            return false;
        }
    }
    return true;
}

// Async function to place queens with visualization
async function placeQueen(board, row, n, placedQueens) {
    if (row === n) return true; // All queens are placed

    for (let col = 0; col < n; col++) {
        if (canPlace(row, col, placedQueens)) {
            board[row][col] = 1;
            placedQueens.push([row, col]);

            // Update board and wait for the next step
            updateBoard(board);
            await delay(delayMs);

            // Recursively try to place the next queen
            if (await placeQueen(board, row + 1, n, placedQueens)) {
                return true;
            }

            // Backtrack: remove the queen and update the board
            board[row][col] = 0;
            placedQueens.pop();

            updateBoard(board);
            await delay(delayMs);
        }
    }
    return false; // No solution found for this configuration
}

async function solveNQueens() {
    const n = Number(nob.value);

    // Create the board and start measuring time
    const board = createBoard(n);
    const placedQueens = [];
    const startTime = performance.now();

    // Solve and calculate time taken
    const foundSolution = await placeQueen(board, 0, n, placedQueens);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    if (foundSolution) {
        updateBoard(board);
        timeDisplay.innerHTML = `Time taken to solve: <span class="text-green-500">${(timeTaken / 1000).toFixed(2)} s</span>`;
    } else {
        timeDisplay.textContent = "No solution found!";
    }
}

// Update board whenever N value changes
nob.addEventListener("change", () => updateBoard());

// Initialize board
updateBoard();
