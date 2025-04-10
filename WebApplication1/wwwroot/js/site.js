document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const gameScreen = document.getElementById("game-screen");
    const congratsScreen = document.getElementById("congrats-screen");
    const startGameBtn = document.getElementById("start-game-btn");
    const puzzleGrid = document.getElementById("puzzle-grid");
    const hintBtn = document.getElementById("hint-btn");
    const guessBtn = document.getElementById("guess-btn");
    const playAgainBtn = document.getElementById("play-again-btn");
    const message = document.getElementById("message");
    const scoreElement = document.getElementById("score-value");
    const wordsFoundElement = document.getElementById("words-found-value");
    const totalWordsElement = document.getElementById("total-words");

    let currentPuzzleIndex = 0;
    let currentPuzzle = puzzles[currentPuzzleIndex];
    let score = 0;
    let wordsFound = 0;
    let foundWords = new Set();
    let selectedCells = [];
    let currentGuess = "";
    let hintIndex = 0;

    // Khởi tạo trò chơi
    startGameBtn.addEventListener("click", () => {
        welcomeScreen.style.display = "none";
        gameScreen.style.display = "block";
        initializePuzzle();
    });

    // Hiển thị ô chữ
    function initializePuzzle() {
        puzzleGrid.innerHTML = "";
        const cols = currentPuzzle.grid[0].length; // Số cột (3 hoặc 4)
        puzzleGrid.style.gridTemplateColumns = `repeat(${cols}, 70px)`; // Điều chỉnh số cột

        for (let i = 0; i < currentPuzzle.grid.length; i++) {
            for (let j = 0; j < currentPuzzle.grid[i].length; j++) {
                const cell = document.createElement("div");
                cell.classList.add("grid-cell");
                cell.textContent = currentPuzzle.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", () => handleCellClick(cell));
                puzzleGrid.appendChild(cell);
            }
        }
        totalWordsElement.textContent = currentPuzzle.words.length;
        wordsFoundElement.textContent = wordsFound;
        message.textContent = "";
        hintIndex = 0;
    }

    // Xử lý khi người chơi bấm vào ô
    function handleCellClick(cell) {
        if (cell.classList.contains("selected")) {
            cell.classList.remove("selected");
            selectedCells = selectedCells.filter(c => c !== cell);
        } else {
            cell.classList.add("selected");
            selectedCells.push(cell);
        }

        currentGuess = selectedCells.map(cell => cell.textContent).join("");
        message.textContent = `Current guess: ${currentGuess}`;
    }

    // Tô màu các ô của từ đã tìm thấy
    function highlightWord(word) {
        const colorIndex = foundWords.size - 1; // Màu dựa trên số từ đã tìm thấy
        for (let row = 0; row < currentPuzzle.grid.length; row++) {
            let rowText = currentPuzzle.grid[row].join("");
            let colStart = rowText.indexOf(word);
            if (colStart !== -1) {
                for (let col = colStart; col < colStart + word.length; col++) {
                    const cell = puzzleGrid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    if (cell) {
                        cell.classList.add(`found-${colorIndex % 4}`); // Sử dụng 4 màu luân phiên
                    }
                }
                break;
            }
        }
    }

    // Xử lý gợi ý
    hintBtn.addEventListener("click", () => {
        const remainingWords = currentPuzzle.words.filter(word => !foundWords.has(word));
        if (remainingWords.length === 0) {
            message.textContent = "No more hints available!";
            return;
        }

        // Trừ 2 điểm khi bấm Hint
        score = Math.max(0, score - 2);
        scoreElement.textContent = score;
        message.textContent = `Hint used (-2 points). Score: ${score}`;

        // Hiển thị gợi ý
        const word = remainingWords[hintIndex % remainingWords.length];
        setTimeout(() => {
            message.textContent = `Hint: ${currentPuzzle.hints[word]}`;
        }, 1000);
        hintIndex++;
    });

    // Xử lý đoán
    guessBtn.addEventListener("click", () => {
        if (!currentGuess) {
            message.textContent = "Please select some letters to form a word!";
            return;
        }

        if (currentPuzzle.words.includes(currentGuess) && !foundWords.has(currentGuess)) {
            foundWords.add(currentGuess);
            wordsFound++;
            score += 10;
            message.textContent = `Correct! You found: ${currentGuess}`;
            wordsFoundElement.textContent = wordsFound;
            scoreElement.textContent = score;

            // Tô màu từ vừa tìm thấy
            highlightWord(currentGuess);

            selectedCells.forEach(cell => cell.classList.remove("selected"));
            selectedCells = [];
            currentGuess = "";

            if (wordsFound === currentPuzzle.words.length) {
                gameScreen.style.display = "none";
                congratsScreen.style.display = "flex";
            }
        } else {
            message.textContent = "Incorrect guess or word already found. Try again!";
            selectedCells.forEach(cell => cell.classList.remove("selected"));
            selectedCells = [];
            currentGuess = "";
        }
    });

    // Xử lý nút "Bạn muốn chơi tiếp?"
    playAgainBtn.addEventListener("click", () => {
        if (currentPuzzleIndex < puzzles.length - 1) {
            currentPuzzleIndex++;
            currentPuzzle = puzzles[currentPuzzleIndex];
            wordsFound = 0;
            foundWords.clear();
            congratsScreen.style.display = "none";
            gameScreen.style.display = "block";
            initializePuzzle();
        } else {
            score = 0;
            currentPuzzleIndex = 0;
            currentPuzzle = puzzles[currentPuzzleIndex];
            wordsFound = 0;
            foundWords.clear();
            scoreElement.textContent = score;
            congratsScreen.style.display = "none";
            welcomeScreen.style.display = "flex";
        }
    });
});