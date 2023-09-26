let GameBoard = (function () {
    'use strict';
    let _token = ' ';
    let _board = [
        //row 1 - 3
        [_token, _token, _token],
        [_token, _token, _token],
        [_token, _token, _token]
    ]
    let getBoard = () => _board;

    //used only in the console version of the game.
    const consoleLogBoard = () => {
        console.log(_board.map((row) => row.join(' | ')).join('\n'))
    }

    const placeToken = (token, row, column) => {
        _board[row][column] = token;
    }

    const placeComputersToken = () => {
        let empty = ' ';
        let [coordinate1, coordinate2] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
        while (_board[coordinate1][coordinate2] !== empty) {
            coordinate1 = Math.floor(Math.random() * 3)
            coordinate2 = Math.floor(Math.random() * 3)
        }
        _board[coordinate1][coordinate2] = 'O';
    }

    let _isHorizontalWin = () => {
        let player1Won = _board.some((row) => row.every((value) => value === 'X'))
        let opponentWon = _board.some((row) => row.every((value) => value === 'O'))
        return player1Won || opponentWon
    }

    let _isVerticalWin = () => {
        let columnOne = [_board[0][0], _board[1][0], _board[2][0]]
        let columnTwo = [_board[0][1], _board[1][1], _board[2][1]]
        let columnThree = [_board[0][2], _board[1][2], _board[2][2]]
        let player1Won = [columnOne, columnTwo, columnThree].some((column) => column.every((value) => value === 'X'))
        let opponentWon = [columnOne, columnTwo, columnThree].some((column) => column.every((value) => value === 'O'))
        return player1Won || opponentWon
    }

    let _isDiagonalWin = () => {
        let topLeftBottomRight = [_board[0][0], _board[1][1], _board[2][2]]
        let bottomLeftTopRight = [_board[2][0], _board[1][1], _board[0][2]]
        let player1Won = [topLeftBottomRight, bottomLeftTopRight].some((diagonal) => diagonal.every((value) => value === 'X'))
        let opponentWon = [topLeftBottomRight, bottomLeftTopRight].some((diagonal) => diagonal.every((value) => value === 'O'))
        return player1Won || opponentWon
    }

    let hasWinner = () => {
        return _isHorizontalWin() || _isVerticalWin() || _isDiagonalWin()
    }

    let isFull = () => {
        return _board.every((row) => row.every((value) => value === 'O' || value === 'X'))
    }

    let reset = () => {
        _board.forEach((_, i, arr) => arr[i] = Array(3).fill(' '))
    }

    //looks at index of board.
    let isLocationOccupied = (row, column) => {
        return _board[row][column] !== ' '
    }

    return { getBoard, consoleLogBoard, placeToken, placeComputersToken, hasWinner, isFull, reset, isLocationOccupied }
})();

let Player = (name, token) => {
    let getToken = () => token;
    let getName = () => name;
    return { getName, getToken, name, token }
}

let GameController = () => {

    let _board = GameBoard;

    let _players = [
        Player('P1', 'X'),
        Player('CPU', 'O')
    ];

    let _activePlayer = _players[0];

    let _switchPlayersTurn = () => {
        _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
    }

    let getActivePlayer = () => _activePlayer;

    let changeOpponent = () => {
        let newOpponent = _players[1].name === 'CPU' ? Player('P2', 'O') : Player('CPU', 'O')
        _players.pop()
        _players.push(newOpponent)
    }

    let _printNewRound = () => {
        _board.consoleLogBoard();
        console.log(`${getActivePlayer().name}'s turn`)
    }

    let _computerPlaysTurn = () => {
        setTimeout(() => {

            _board.placeComputersToken()
            if (_board.hasWinner()) {
                _board.consoleLogBoard()
                return `${getActivePlayer().name} WON`
            }
            _switchPlayersTurn();
            _printNewRound();
        }, '1200')
    }

    let playRound = (row, column) => {
        //if location on board is occupied. don't place token.
        if (_board.isLocationOccupied(row, column)) { return }
        _board.placeToken(getActivePlayer().token, row, column)
        //after placing the players token, check if they won.
        if (_board.hasWinner()) {
            //if player won - log winner, exit function
            console.log(`${getActivePlayer().name} WON`)
            return
        } else if (_board.isFull()) { return 'TIE' }
        _switchPlayersTurn();
        _printNewRound();
        if (getActivePlayer().name === 'CPU') { _computerPlaysTurn() }
    }

    let restartGame = () => {
        if (getActivePlayer().name !== 'P1') { _switchPlayersTurn() }
        _board.reset()
        _printNewRound()
        return
    };

    _printNewRound()

    return { playRound, getActivePlayer, restartGame, getBoard: _board.getBoard, changeOpponent }
}

//alternate X's and O's for values in randomly generated board
// function generateRandomBoard() {
//     let options = {
//         0: 'X',
//         1: 'O',
//     }
//     let xCount = 0;
//     let oCount = 0;
//     let gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']]
//     while (gameBoard.some((row) => row.some((value) => value === ' '))) {
//         let empty = ' ';
//         let input;
//         let [coordinate1, coordinate2] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
//         while (gameBoard[coordinate1][coordinate2] !== empty) {
//             coordinate1 = Math.floor(Math.random() * 3)
//             coordinate2 = Math.floor(Math.random() * 3)
//         }
//         if (xCount > oCount) {
//             input = 'O';
//         } else if (xCount < oCount) {
//             input = 'X';
//         } else {
//             input = options[Math.floor(Math.random() * 2)]
//         }
//         input === 'X' ? xCount++ : oCount++
//         gameBoard[coordinate1][coordinate2] = input
//     }
//     return gameBoard
// }

let ScreenController = function () {
    const game = GameController();
    const opponentNode = document.querySelector('.opponent');
    const boardNode = document.querySelector('.gameboard');
    const p1ScoreDiv = document.querySelector('.scores .p1_score');
    const opponentScoreDiv = document.querySelector('.scores .opponent_score');
    const restartBtn = document.querySelector('#restartBtn');
    let allSquares;

    let scoreHasBeenAdded;
    let isTie;

    const _board = game.getBoard();

    const { restartGame, changeOpponent, getActivePlayer } = game;

    function restart() {
        restartGame()
        updateScreen();
    }

    function resetScores() {
        p1ScoreDiv.textContent = '0'
        opponentScoreDiv.textContent = '0'
    }

    function waitForComputersTurn() {
        // if (GameBoard.hasWinner()) { return }
        //add square.disabled = true; to every square.
        //then after '2001' ms, square.disabled = false;
        allSquares.forEach((squareBtn) => {
            squareBtn.disabled = true;
        })
        //after computer plays turn. updates board. enables buttons.
        setTimeout(() => {
            updateScreen();
            allSquares.forEach((squareBtn) => {
                squareBtn.disabled = false;
            });
            handleTie()
            if (GameBoard.hasWinner()) { increaseCurrentPlayerScore() }
        }
            , '1210')
    }

    const updateScreen = () => {
        //clear the board
        boardNode.textContent = '';

        let column = 0
        //connects the values of the board array to the DOM nodes
        _board.forEach((row, index) => {
            row.forEach(square => {
                if (column === 3) { column = 0 }
                const squareButton = document.createElement('button');
                squareButton.classList.add('square');
                squareButton.dataset.row = index;
                squareButton.dataset.column = column
                squareButton.textContent = square;
                if (square === 'X') {
                    squareButton.style.color = '#4664a8'
                } else if (square === 'O') {
                    squareButton.style.color = '#f24b4d'
                }
                boardNode.appendChild(squareButton);
                column += 1
            })
        })
        allSquares = document.querySelectorAll('.square')
    }

    function handleTie() {
        if (isTie) {
            restartGame();
            updateScreen();
            isTie = undefined
        }
        if (GameBoard.isFull() && !GameBoard.hasWinner()) {
            isTie = true
        }
    }

    function increaseCurrentPlayerScore() {
        let currentPlayer = getActivePlayer().name;
        let p1Score = Number(p1ScoreDiv.textContent)
        let opponentScore = Number(opponentScoreDiv.textContent)
        if (GameBoard.hasWinner() && scoreHasBeenAdded) {
            restartGame();
            updateScreen();
            scoreHasBeenAdded = undefined
            return
        }
        if (currentPlayer === 'P1') {
            p1Score++
            p1ScoreDiv.textContent = String(p1Score)
            scoreHasBeenAdded = true
        } else if (currentPlayer === 'P2' || currentPlayer === 'CPU') {
            opponentScore++
            opponentScoreDiv.textContent = String(opponentScore)
            scoreHasBeenAdded = true
        }
    }

    function toggleOpponent(e) {
        if (e.target.textContent === 'CPU') {
            e.target.textContent = 'P2';
            e.target.nextElementSibling.style.display = 'none'
            changeOpponent()
        } else if (e.target.textContent === 'P2') {
            e.target.textContent = 'CPU';
            e.target.nextElementSibling.style.display = 'inline'
            changeOpponent()
        }
        if (e.target.textContent === 'EASY') {
            e.target.textContent = 'MEDIUM';
            e.target.style.right = '18px';
        } else if (e.target.textContent === 'MEDIUM') {
            e.target.textContent = 'EASY';
            e.target.style.right = '40px';
        }
        resetScores()
        restartGame();
        updateScreen();
    }

    function clickHandlerBoard(e) {
        let selectedRow = e.target.dataset.row;
        let selectedColumn = e.target.dataset.column;
        game.playRound(selectedRow, selectedColumn)
        updateScreen();
        //computers turn checks to see if the computer won.
        if (getActivePlayer().name === 'CPU') { waitForComputersTurn() }
        handleTie()
        if (GameBoard.hasWinner()) { increaseCurrentPlayerScore() }
    }
    updateScreen()
    restartBtn.addEventListener('click', restart)
    boardNode.addEventListener('click', clickHandlerBoard);
    opponentNode.addEventListener('click', toggleOpponent)
}


ScreenController();