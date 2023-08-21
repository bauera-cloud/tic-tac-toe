let gameBoard = (function () {
    'use strict';
    let _gameBoard = [];
    let _rows = 3;
    let _columns = 3;
    for (let i = 0; i < _rows; i++) {
        _gameBoard[i] = [];
        for (let j = 0; j < _columns; j++) {
            _gameBoard[i].push('')
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

//will prompt player for their name...later...ui to change it.
const Player = (name = 'Player One') => {
    let value = 1; //later an x

}


gameBoard.printBoard();