let gameBoard = (function () {
    'use strict';
    let _gameBoard = [];
    let _rows = 3;
    let _columns = 3;
    for (let i = 0; i < _rows; i++) {
        _gameBoard[i] = [];
        for (let j = 0; j < _columns; j++) {
            _gameBoard[i].push(' ')
        }
    };
    let getBoard = () => _gameBoard;

    //used only in the console version of the game.
    const printBoard = () => {
        const boardWithCellValues = _gameBoard.map((row) => row.map((cell) => cell))
        console.log(boardWithCellValues);
    };

    return { getBoard, printBoard }
})();

// gameBoard.printBoard();

let fakeChoice = ' ';
let fakeBoard = [
    //row 1 - 3
    [fakeChoice, fakeChoice, fakeChoice],
    [fakeChoice, fakeChoice, fakeChoice],
    [fakeChoice, fakeChoice, fakeChoice]
]

//makes array of arrays to 3 strings(rows) separated by a newline
function consoleLogNewBoard(fakeBoard) {
    console.log(fakeBoard.map((row) => row.join(' | ')).join('\n'))
}

//expected typeof number (1, 3) for ex. number represents the row not the index.
function coordinatesForChoice(row, column) {
    fakeBoard[row - 1][column - 1] = 'X';
}

function opponentsTurn() {
    let empty = ' ';
    let [coordinate1, coordinate2] = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
    while (fakeBoard[coordinate1][coordinate2] !== empty) {
        coordinate1 = Math.floor(Math.random() * 3)
        coordinate2 = Math.floor(Math.random() * 3)
    }
    fakeBoard[coordinate1][coordinate2] = 'O';
    consoleLogNewBoard(fakeBoard)
}

//asks for expected string '1 3'.turns each into their own number placed into their respective variables. puts an "X" into coordinates. Shows new board.
function playRound() {
    let tokenPlacement = prompt('Separated by a space, enter the row, then column for your placement');
    let [row, column] = tokenPlacement.split(' ').map(Number)
    coordinatesForChoice(row, column)
    consoleLogNewBoard(fakeBoard)
    setTimeout(opponentsTurn, '1500');
}

//asks user for first move
playRound()


