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

    const placeToken = (token, coordinates) => {
        coordinates = coordinates.split(' ').map(Number);
        let [row, column] = coordinates
        _board[row - 1][column - 1] = token;
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
        return _board.some((row) => row.every((value) => value === 'X' || value === 'O'))
    }

    let _isVerticalWin = () => {
        let columnOne = [_board[0][0], _board[1][0], _board[2][0]]
        let columnTwo = [_board[0][1], _board[1][1], _board[2][1]]
        let columnThree = [_board[0][2], _board[1][2], _board[2][2]]
        return [columnOne, columnTwo, columnThree].some((column) => column.every((value) => value === 'X'))
    }

    let _isDiagonalWin = () => {
        let topLeftBottomRight = [_board[0][0], _board[1][1], _board[2][2]]
        let bottomLeftTopRight = [_board[2][0], _board[1][1], _board[0][2]]
        return [topLeftBottomRight, bottomLeftTopRight].some((diagonal) => diagonal.every((value) => value === 'X' || value === 'O'))
    }

    let hasWinner = () => {
        return _isHorizontalWin() || _isVerticalWin() || _isDiagonalWin()
    }

    let isTie = () => {
        return _board.every((row) => row.every((value) => value === 'O' || value === 'X'))
    }

    let reset = () => {
        _board.forEach((_, i, arr) => arr[i] = Array(3).fill(' '))
    }

    let isLocationOccupied = (coordinates) => {
        let [row, column] = coordinates.split(' ').map(Number);
        return _board[row - 1][column - 1] !== ' '
    }

    return { getBoard, consoleLogBoard, placeToken, placeComputersToken, hasWinner, isTie, reset, isLocationOccupied }
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

    let coordinates;

    let _activePlayer = _players[0];

    let _switchPlayersTurn = () => {
        _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
    }

    let getActivePlayer = () => _activePlayer;

    let _chooseOpponent = () => {
        let opponent = prompt("Play against: 'c' for CPU or 'p2' for P2") === 'p2' ? Player('P2', 'O') : Player('CPU', 'O')
        _players.pop()
        _players.push(opponent)
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
        }, '2000')
    }

    let _invalidInput = () => {
        return !/\d \d/.test(coordinates)
    }

    //or if a player choose coordinates that are already occupied.
    let _getValidInput = () => {
        while (_invalidInput(coordinates) || _board.isLocationOccupied(coordinates)) {
            if (_invalidInput(coordinates)) {
                coordinates = prompt('Invalid input. Separated by a space, enter the row, then column for your token placement.')
            } else if (_board.isLocationOccupied(coordinates)) {
                coordinates = prompt('Occupied location. Try again.')
            }
        }
    }

    let playRound = () => {
        coordinates = prompt('Separated by a space, enter the row, then column for your token placement');
        if (_invalidInput() || _board.isLocationOccupied(coordinates)) { _getValidInput() }
        _board.placeToken(getActivePlayer().token, coordinates)
        if (_board.hasWinner()) { return `${getActivePlayer().name} WON` }
        if (_board.isTie()) { return 'TIE' }
        _switchPlayersTurn();
        _printNewRound();
        if (getActivePlayer().name === 'CPU') { _computerPlaysTurn() }
    }

    let restartGame = () => {
        if (getActivePlayer().name === 'P2') { _switchPlayersTurn() }
        _board.reset()
        _printNewRound()
        return
    };

    // _chooseOpponent()
    _printNewRound()

    return { playRound, getActivePlayer, restartGame }
}

let game = GameController();

//alternate X's and O's for values in randomly generated board
function generateRandomBoard() {
    let options = {
        0: 'X',
        1: 'O',
    }
    let xCount = 0;
    let oCount = 0;
    let gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']]
    while (gameBoard.some((row) => row.some((value) => value === ' '))) {
        let empty = ' ';
        let input;
        let [coordinate1, coordinate2] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
        while (gameBoard[coordinate1][coordinate2] !== empty) {
            coordinate1 = Math.floor(Math.random() * 3)
            coordinate2 = Math.floor(Math.random() * 3)
        }
        if (xCount > oCount) {
            input = 'O';
        } else if (xCount < oCount) {
            input = 'X';
        } else {
            input = options[Math.floor(Math.random() * 2)]
        }
        input === 'X' ? xCount++ : oCount++
        gameBoard[coordinate1][coordinate2] = input
    }
    return gameBoard
}


//location = 'X' | ' ' | 'O'
function isLocationOccupied(location) {

}
//board[0][1], board[1][1] is occupied by X or O
console.log(isLocationOccupied([' ', 'X', ' '], [' ', 'O', 'X'], ['O', ' ', ' ']))