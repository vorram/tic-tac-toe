const gameboard = (() => {
    const cells = Array.from(document.querySelectorAll('.cell'));
    cells.forEach(element => element.isAvailable = true);
    cells.forEach(element => element.addEventListener('mouseover', (e) => {
        if (e.target.isAvailable) {
        e.target.style.color = 'rgba(0, 0, 0, 0.2)';
        if (player1.isActive) {
            e.target.textContent = player1.marker;
        } else if (player2.isActive) {
            e.target.textContent = player2.marker;
        }
        }
    }));
    cells.forEach(element => element.addEventListener('mouseout', (e) => {
        if (e.target.isAvailable) {
        e.target.style.color = 'black';
        e.target.textContent = '';
        }
    }));
    cells.forEach(element => element.addEventListener('click', (e) => {
        if (e.target.isAvailable) {
        e.target.isAvailable = false;
        e.target.style.color = 'black';
        if (player1.isActive) {
            e.target.textContent = player1.marker;
            cells[cells.indexOf(e.target)].marker = player1.marker;
            if (winCheck(cells, player1.marker)) {
                gameEnd(player1);
            } else if (drawCheck()) {
                draw();
            } else {
                player1.isActive = false;
                player2.isActive = true;
            }
            if (player2.isActive && player2.isAI) {
                if (display.easy.checked) {
                    aiMoveEasy();
                } else if (display.medium.checked) {
                    aiMoveMedium();
                } else if (display.hard.checked) {
                    aiMoveHard();
                } 
                if (winCheck(cells, player2.marker)) {
                    gameEnd(player2);
                } else if (drawCheck()) {
                    draw();
                } else {
                    player1.isActive = true;
                    player2.isActive = false;
                }
            }
        } else if (player2.isActive && !player2.isAI) { 
            e.target.textContent = player2.marker;
            cells[cells.indexOf(e.target)].marker = player2.marker;
            if (winCheck(cells, player2.marker)) {
                gameEnd(player2);
            } else if (drawCheck()) {
                draw();
            } else {
                player1.isActive = true;
                player2.isActive = false;
            }
        }
        }
    }));
    const winCheck = (array, marker) => {
        if ((array[0].marker == marker && array[1].marker == marker && array[2].marker == marker) ||
        (array[3].marker == marker && array[4].marker == marker && array[5].marker == marker) ||
        (array[6].marker == marker && array[7].marker == marker && array[8].marker == marker) ||
        (array[0].marker == marker && array[3].marker == marker && array[6].marker == marker) || 
        (array[1].marker == marker && array[4].marker == marker && array[7].marker == marker) ||
        (array[2].marker == marker && array[5].marker == marker && array[8].marker == marker) ||
        (array[0].marker == marker && array[4].marker == marker && array[8].marker == marker) ||
        (array[2].marker == marker && array[4].marker == marker && array[6].marker == marker)) {
            return true;
        }
    };
    const drawCheck = () => {
        let draw = true;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].marker === undefined) {
                draw = false;
            }
        }
        return draw;
    };
    const draw = () => {
        display.draw();
        display.button();
        player1.isActive = false;
        player2.isActive = false;
    };
    const gameEnd = (player) => {
        display.winner(player.name);
        player.score++;
        display.score();
        display.button();
        player1.isActive = false;
        player2.isActive = false;
    };
    const newGame = () => {
        cells.forEach(element => element.isAvailable = true);
        cells.forEach(element => element.textContent = '');
        cells.forEach(element => element.marker = undefined);
        player1.isActive = true;
    };
    const random = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const aiMoveEasy = () => {
        let move = random(0, 8);
        if (cells[move].isAvailable) {
            cells[move].textContent = player2.marker;
            cells[move].marker = player2.marker;
            cells[move].isAvailable = false;
        } else {
            aiMoveEasy();
        }
    };
    const aiMoveMedium = () => {
        let boardCopy = cells;
        let move;
        for (let i = 0; i < boardCopy.length; i++) {
            if (boardCopy[i].isAvailable) {
                boardCopy[i].marker = player2.marker;
                if (winCheck(boardCopy, player2.marker)) {
                    move = i;
                    cells[move].textContent = player2.marker;
                    cells[move].marker = player2.marker;
                    cells[move].isAvailable = false;
                    break;
                } else {
                    boardCopy[i].marker = undefined;
                }
            }
        }
        const generateMove = () => {
            move = random(0, 8);
            if (!cells[move].isAvailable) {
                generateMove();
            }
        };
        if (!move && move !== 0) {
            generateMove();
        }
        cells[move].textContent = player2.marker;
        cells[move].marker = player2.marker;
        cells[move].isAvailable = false;
    };
    const aiMoveHard = () => {
        let boardCopy = cells;
        let move;
        for (let i = 0; i < boardCopy.length; i++) {
            if (boardCopy[i].isAvailable) {
                boardCopy[i].marker = player2.marker;
                if (winCheck(boardCopy, player2.marker)) {
                    move = i;
                    break;
                } else {
                    boardCopy[i].marker = undefined;
                }
            }
        }
        if (!move && move !== 0) {
        for (let i = 0; i < boardCopy.length; i++) {
            if (boardCopy[i].isAvailable) {
                boardCopy[i].marker = player1.marker;
                if (winCheck(boardCopy, player1.marker)) {
                    move = i;
                    break;
                } else {
                    boardCopy[i].marker = undefined;
                }
            }
            }
        }
        const generateMove = () => {
            move = random(0, 8);
            if (!cells[move].isAvailable) {
                generateMove();
            }
        };
        if (!move && move !== 0) {
            generateMove();
        }
        cells[move].textContent = player2.marker;
        cells[move].marker = player2.marker;
        cells[move].isAvailable = false;
    };
    return {
        newGame,
    };
})();

const Player = (name, marker) => {
    let score = 0;
    let isActive = false;
    return {name, marker, isActive, score};
};

let player1 = Player('Player 1', '×');
let player2 = Player('Player 2', '○');

const display = (() => {
    const player1display = document.getElementById('player1-name-display');
    const player2display = document.getElementById('player2-name-display');
    const player1name1 = document.getElementById('player1-name1');
    const player1name2 = document.getElementById('player1-name2');
    const player2name = document.getElementById('player2-name');
    const winnerDisplay = document.getElementById('winner-display');
    const start1Btn = document.getElementById('start1');
    const start2Btn = document.getElementById('start2');
    const newGameForm = document.getElementById('new-game-form');
    const newGameForm1 = document.getElementById('new-game-form1');
    const newGameForm2 = document.getElementById('new-game-form2');
    const player1score = document.getElementById('player1-score');
    const player2score = document.getElementById('player2-score');
    const newGameBtn = document.getElementById('new-game');
    const onePlayerBtn = document.getElementById('one-player');
    const twoPlayersBtn = document.getElementById('two-players');
    const easy = document.getElementById('easy');
    const medium = document.getElementById('medium');
    const hard = document.getElementById('hard');
    start1Btn.addEventListener('click', () => {
        if (player1name1.value) {
            player1display.textContent = player1name1.value;
            player1.name = player1name1.value;
        } else {
            player1display.textContent = 'Player 1';
        }
        player2display.textContent = 'Computer';
        player1score.textContent = 'Score: 0';
        player2score.textContent = 'Score: 0';
        newGameForm1.style.display = 'none';
        player2.name = 'Computer';
        player2.isAI = true;
        player1.isActive = true;
    });
    start2Btn.addEventListener('click', () => {
        if (player1name2.value) {
            player1display.textContent = player1name2.value;
            player1.name = player1name2.value;
        } else {
            player1display.textContent = 'Player 1';
        }
        if (player2name.value) {
            player2display.textContent = player2name.value;
            player2.name = player2name.value;
        } else {
            player2display.textContent = 'Player 2';
        }
        player1score.textContent = 'Score: 0';
        player2score.textContent = 'Score: 0';
        newGameForm2.style.display = 'none';
        player2.isAI = false;
        player1.isActive = true;
    });
    newGameBtn.addEventListener('click', () => {
        gameboard.newGame();
        newGameBtn.style.display = 'none';
        winnerDisplay.textContent = '';
    });
    onePlayerBtn.addEventListener('click', () => {
        newGameForm.style.display = 'none';
        newGameForm2.style.display = 'none';
    });
    twoPlayersBtn.addEventListener('click', () => {
        newGameForm.style.display = 'none';
        newGameForm1.style.display = 'none';
    });
    const score = () => {
        player1score.textContent = `Score: ${player1.score}`;
        player2score.textContent = `Score: ${player2.score}`;
    };
    const winner = (player) => {
        winnerDisplay.textContent = `${player} wins!`;
    };
    const button = () => {
        newGameBtn.style.display = 'inline';
    };
    const draw = () => {
        winnerDisplay.textContent = 'It\'s a tie!';
    };
    return {
        winner,
        score,
        button,
        draw,
        easy,
        medium,
        hard,
    };
})();

