let gameBoard = (function () {
    'use strict';
    let _fakeChoice = ' ';
    let _fakeBoard = [
        //row 1 - 3
        [_fakeChoice, _fakeChoice, _fakeChoice],
        [_fakeChoice, _fakeChoice, _fakeChoice],
        [_fakeChoice, _fakeChoice, _fakeChoice]
    ]
    let getBoard = () => _fakeBoard;

    //used only in the console version of the game.
    const consoleLogNewBoard = () => {
        console.log(_fakeBoard.map((row) => row.join(' | ')).join('\n'))
    }

    return { getBoard, consoleLogNewBoard }
})();

// gameBoard.consoleLogNewBoard();

let fakeChoice = ' ';
let fakeBoard = [
    //row 1 - 3
    [fakeChoice, fakeChoice, fakeChoice],
    [fakeChoice, fakeChoice, fakeChoice],
    [fakeChoice, fakeChoice, fakeChoice]
]

let getBoard = () => fakeBoard

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
    let tokenPlacement = prompt('Separated by a space, enter the row, then column for your token placement');
    let [row, column] = tokenPlacement.split(' ').map(Number)
    coordinatesForChoice(row, column)
    consoleLogNewBoard(fakeBoard)
    setTimeout(opponentsTurn, '1500');
}

//asks user for first move
// playRound()










//code challenge #1
//console game should not allow for player(s) to make a move 
//on an occupied location

//'2 3'
//return 'Sorry, location is occupied. Choose another location.'





//code challenge #2
//if input isn't '2 3'
//return 'Invalid Input. Separated by a space, enter the row, then column for your token placement'





//code challenge #3
//console game should check for 3 in a row

//horizontal win input: [['X', 'X', 'X'],[' ', 'O', ' '],['O', 'O', ' ']]
//If I want to check if either player won - put: || value === 'O'.
function isHorizontalWin(gameBoard) {
    let p1 = gameBoard.some((row) => row.every((value) => value === 'X'))
    let opponent = gameBoard.some((row) => row.every((value) => value === 'O'))
    return p1 ? 'player' : opponent ? 'opponent' : false
}
console.log(isHorizontalWin([['X', 'X', ' '], ['X', 'O', 'X'], ['O', 'O', 'O']]))

//vertical win input: col 1: [['X', ' ', 'O'],['X', 'O', ' '],['X', 'O', ' ']]
//If I want to check if either player won vertically add: || value === 'O'
function isVerticalWin(gameBoard) {
    let columnOne = [gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]]
    let columnTwo = [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]]
    let columnThree = [gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]]
    let p1 = [columnOne, columnTwo, columnThree].some((column) => column.every((value) => value === 'X'))
    let opponent = [columnOne, columnTwo, columnThree].some((column) => column.every((value) => value === 'O'))
    return p1 ? 'player' : opponent ? 'opponent' : false
}
console.log(isVerticalWin([['X', 'O', 'O'], ['X', 'O', ' '], [' ', 'O', ' ']]))

//diagonal win input: [['X', ' ', 'O'],[' ', 'X', ' '],['O', 'O', 'X']]
function isDiagonalWin(gameBoard) {
    //diagonal arrays
    let topLeftBottomRight = [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]]
    let bottomLeftTopRight = [gameBoard[2][0], gameBoard[1][1], gameBoard[0][2]]
    let p1 = [topLeftBottomRight, bottomLeftTopRight].some((diagonal) => diagonal.every((value) => value === 'X'))
    let opponent = [topLeftBottomRight, bottomLeftTopRight].some((diagonal) => diagonal.every((value) => value === 'O'))
    return p1 ? 'player' : opponent ? 'opponent' : false
}
console.log(isDiagonalWin([[' ', ' ', 'X'], [' ', 'X', ' '], ['X', 'O', ' ']]))

//from a randomly generated board, check if X won and console.log the board.
function checkWhoWon(gameBoard) {
    let opponent = 'CPU';
    if (isHorizontalWin(gameBoard) === 'player' || isVerticalWin(gameBoard) === 'player' || isDiagonalWin(gameBoard) === 'player') {
        return 'P1 WON'
    } else if (isHorizontalWin(gameBoard) === 'opponent' || isVerticalWin(gameBoard) === 'opponent' || isDiagonalWin(gameBoard) === 'opponent') {
        return `${opponent} WON`
    } else {
        return 'TIE'
    }
}

//alternate X's and O's for values in randomly generated board
function generateRandomBoard(gameBoard) {
    let options = {
        0: 'X',
        1: 'O',
    }
    let xCount = 0;
    let oCount = 0;
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

let newBoard = generateRandomBoard(fakeBoard)
console.log(newBoard, checkWhoWon(newBoard))
