

let rowArray = ["8", "7", "6", "5", "4", "3", "2", "1"];
// columnArray was formerly a-h.
let columnArray = ["1", "2", "3", "4", "5", "6", "7", "8"];
let pieceName = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook", "pawn"]
let invalidSpaces = [19, 20, 29, 30, 39, 40, 49, 50, 59, 60, 69, 70, 79, 80];

let turnCount = 1;
let enPassantWhite = {
    empty: "",
    current: "",
    turn: 0
};
let enPassantBlack = {
    empty: "",
    current: "",
    turn: 0
};

let currentPiece = {
    type: "",
    color: "",
    location: "",
    source: ""
};

let pieceSelected = 0;
let previousPiece = 0;
let previousMoves = [0];


function initGameBoard() {

    let gameBoard = document.getElementById("gameBoard");

    for (let i = 0; i < 8; i++) {

        let Row = document.createElement("div");
        Row.className = "boardRow";

        for (let j = 0; j< 8; j++) {

            let rowNum = rowArray[i];
            let columnNum = columnArray[j];

            let column = document.createElement("div");
            let cell = document.createElement("img");

            column.className = "boardColumn";
            cell.setAttribute("id", `${columnNum}${rowNum}`);
            cell.setAttribute("class", "empty");
            // cell.setAttribute("src", "");
            // cell.setAttribute("alt", `${columnNum}${rowNum}`);
            cell.setAttribute("width", "60px");
            cell.setAttribute("height", "60px");

            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    column.style.backgroundColor = "white";
                } else {
                    column.style.backgroundColor = "darkgray";
                }
            } else {
                if (j % 2 == 0) {
                    column.style.backgroundColor = "darkgray";
                } else {
                    column.style.backgroundColor = "white";
                }
            }

            column.appendChild(cell);
            Row.appendChild(column);
        }

        gameBoard.appendChild(Row);

    }

}

function resetPieces() {

    for (let i = 0; i < 2; i++) {

        for (let j = 0; j < 8; j++) {

            let blackRow = rowArray[i+6];
            let whiteRow = rowArray[i];
            let setColumn = columnArray[j];

            let blackPiece;
            let whitePiece;

            let blackSpawnCell = document.getElementById(`${setColumn}${blackRow}`);
            let whiteSpawnCell = document.getElementById(`${setColumn}${whiteRow}`);

            if (blackRow == "2") {
                blackPiece = "pawnB";
            } else {
                blackPiece = `${pieceName[j]}B`;
            }

            if (whiteRow == "7") {
                whitePiece = "pawnW";
            } else {
                whitePiece = `${pieceName[j]}W`;
            }

            blackSpawnCell.setAttribute("src", `./pieces/${blackPiece}.png`);
            whiteSpawnCell.setAttribute("src", `./pieces/${whitePiece}.png`);

            if (blackSpawnCell.getAttribute("src") !== "") {
                blackSpawnCell.className = "black";
            }
            
            if (whiteSpawnCell.getAttribute("src") !== "") {
                whiteSpawnCell.className = "white";
            }

        }

    }

}

document.getElementById("gameBoard").addEventListener("click", (e) => {

    const targetPiece = e.target;

    if (previousPiece == 0) {
        previousPiece = targetPiece;
    } else if (targetPiece != previousPiece) {
        previousPiece.style.backgroundColor = "rgba(0, 0, 0, 0)";
        previousPiece = targetPiece;
    }

    if (currentPiece.color != targetPiece.getAttribute("class") && pieceSelected == 1 || targetPiece.classList.contains("empty")) {

        if (pieceSelected == 1) {
            movePiece(targetPiece);
        }

        currentPiece = {
            type: "",
            color: targetPiece.getAttribute("class"),
            location: "",
            source: ""
        };

        setMoveRange();

        pieceSelected = 0;
        previousMoves = [0];

        // console.log("Empty");
        return;

    }

    if (turnCount % 2 == 0) {
        if (targetPiece.getAttribute("class") != "black") {
            return;
        }
    } else if (turnCount % 2 != 0) {
        if (targetPiece.getAttribute("class") != "white") {
            return;
        }
    }

    currentPiece.source = targetPiece.getAttribute("src");
    currentPiece.color = targetPiece.getAttribute("class");
    currentPiece.location = targetPiece.getAttribute("id");

    for (let i = 0; i < 6; i++) {
        if (currentPiece.source.includes(pieceName[i+3])) {
            currentPiece.type = pieceName[i+3];
        }
    }

    // console.log(currentPiece);

    pieceSelected = 1;
    targetPiece.style.backgroundColor = "rgba(144, 238, 144, 0.6)";

    setMoveRange();

})

function setMoveRange() {

    let possibleMoves = [];
    let tempMoveArray = [];
    let tempMove;

    let startingLocation = Number(currentPiece.location);
    let directionSet = [1, -1, 10, -10];
    let specialMove = 0;
    
    if (currentPiece.type === "pawn") {
        let moveDist;
    
        if (currentPiece.color == "black") {
            moveDist = 1;
            if (currentPiece.location[1] == 2) {
                enPassantBlack.empty = startingLocation + moveDist;
                specialMove = 1;
                enPassantBlack.current = startingLocation + moveDist + specialMove;
            }
        } else if (currentPiece.color == "white") {
            moveDist = -1;
            if (currentPiece.location[1] == 7) {
                enPassantWhite.empty = startingLocation + moveDist;
                specialMove = -1;
                enPassantWhite.current = startingLocation + moveDist + specialMove;
            }
        }
    
        possibleMoves.push(startingLocation + moveDist);

        if (specialMove !== 0) {
            possibleMoves.push(startingLocation + moveDist + specialMove);    
        }

        for (let i = 0; i < possibleMoves.length; i++) {
            if (document.getElementById(possibleMoves[i]).getAttribute("class") != "empty") {
                possibleMoves.splice(i, 2);
            }
        }

        tempMoveArray.push(startingLocation + moveDist - 10);
        tempMoveArray.push(startingLocation + moveDist + 10);
        validLocation(tempMoveArray);

        for (let i = 0; i < tempMoveArray.length; i++) {  
            let pawnAttack = document.getElementById(tempMoveArray[i]);
            if (currentPiece.color == "black") {
                if (pawnAttack.classList.contains("white")) {
                    possibleMoves.push(tempMoveArray[i]);
                }
            } else if (currentPiece.color == "white") {
                if (pawnAttack.classList.contains("black")) {
                    possibleMoves.push(tempMoveArray[i]);
                }
            }
        }

        validLocation(possibleMoves);

    } else if (currentPiece.type == "rook") {

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 8; j++) {
                tempMove = startingLocation + (directionSet[i] * (j+1));

                tempMoveArray.push(tempMove);

                validLocation(tempMoveArray);

                if (tempMove != tempMoveArray[tempMoveArray.length - 1]) {
                    tempMove = null;
                }

                // console.log(tempMove);

                if (tempMove == null || document.getElementById(tempMove).getAttribute("class") != "empty") {
                    // console.log("Path is blocked.");
                    if (tempMove != null && currentPiece.color == "black" && document.getElementById(tempMove).getAttribute("class") == "white") {
                        possibleMoves.push(tempMove);
                    } else if (tempMove != null && currentPiece.color == "white" && document.getElementById(tempMove).getAttribute("class") == "black") {
                        possibleMoves.push(tempMove);
                    }
                    break;
                } else {
                    possibleMoves.push(tempMove);
                }
            }
        }

        validLocation(possibleMoves);
        // console.log(possibleMoves);

    } else if (currentPiece.type == "knight") {
        console.log("knight");

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {

                if (directionSet[i] > 1 || directionSet[i] < -1) {
                    tempMoveArray.push(startingLocation + (directionSet[i] * 2) + (directionSet[j]));
                } else {
                    tempMoveArray.push(startingLocation + (directionSet[i] * 2) + (directionSet[j+2]));
                }

                validLocation(tempMoveArray);
                // console.log(tempMoveArray);

            }
        }

        for (let k = 0; k < tempMoveArray.length; k++) {
            if (document.getElementById(tempMoveArray[k]).getAttribute("class") != currentPiece.color) {
                possibleMoves.push(tempMoveArray[k]);
            }
        }

        // console.log(possibleMoves);

    } else if (currentPiece.type == "bishop") {
        console.log("bishop");
    } else if (currentPiece.type == "queen") {
        console.log("queen");
    } else if (currentPiece.type == "king") {
        console.log("king");
    }

    // console.log(possibleMoves);

    if (previousMoves[0] == 0) {
        previousMoves = possibleMoves;
        // console.log(previousMoves);
    } else if (possibleMoves !== previousMoves) {
        for (let i = 0; i < previousMoves.length; i++) {
            document.getElementById(previousMoves[i]).style.backgroundColor = "rgba(0, 0, 0, 0)";
        }
        previousMoves = possibleMoves;
    }

    if (currentPiece.color != "empty") {
        for (let j = 0; j < possibleMoves.length; j++) {
            document.getElementById(possibleMoves[j]).style.backgroundColor = "rgba(255, 255, 0, 0.6)";
        }
    }

}

function movePiece(potentialMove) {

    if (potentialMove.style.backgroundColor == "rgba(255, 255, 0, 0.6)") {

        let lastPiece;
        let passantSpace = "";

        if (currentPiece.type == "pawn" && currentPiece.color == "white" && potentialMove.getAttribute("id") == enPassantBlack.empty) {
            lastPiece = document.getElementById(enPassantBlack.current);
            passantSpace = document.getElementById(currentPiece.location);
        } else if (currentPiece.type == "pawn" && currentPiece.color == "black" && potentialMove.getAttribute("id") == enPassantWhite.empty) {
            lastPiece = document.getElementById(enPassantWhite.current);
            passantSpace = document.getElementById(currentPiece.location);
        } else {
            lastPiece = document.getElementById(currentPiece.location);
        }

        if (currentPiece.type == "pawn" && currentPiece.color == "black" && potentialMove.getAttribute("id")[1] == 4 && currentPiece.location[1] == 2) {
            document.getElementById(enPassantBlack.empty).setAttribute("class", currentPiece.color);
            enPassantBlack.turn = turnCount;
        } else if (currentPiece.type == "pawn" && currentPiece.color == "white" && potentialMove.getAttribute("id")[1] == 5 && currentPiece.location[1] == 7) {
            document.getElementById(enPassantWhite.empty).setAttribute("class", currentPiece.color);
            enPassantWhite.turn = turnCount;
        }

        potentialMove.setAttribute("class", currentPiece.color);
        potentialMove.setAttribute("src", currentPiece.source);

        lastPiece.setAttribute("class","empty");
        lastPiece.setAttribute("src", "");
        lastPiece.removeAttribute("src");

        let parent = lastPiece.parentNode;
        parent.removeChild(lastPiece);
        parent.appendChild(lastPiece);


        if (passantSpace !== "") {
            passantSpace.setAttribute("class","empty");
            passantSpace.setAttribute("src", "");
            passantSpace.removeAttribute("src");
        }

        turnCount += 1;
        
        if (enPassantBlack.turn != 0 && turnCount > enPassantBlack.turn + 1) {
            if (!document.getElementById(enPassantBlack.empty).hasAttribute("src")) {
                document.getElementById(enPassantBlack.empty).setAttribute("class", "empty");
            }
            enPassantBlack = {
                empty: "",
                current: "",
                turn: 0
            };
        } else if (enPassantWhite.turn != 0 && turnCount > enPassantWhite.turn + 1) {
            if (!document.getElementById(enPassantWhite.empty).hasAttribute("src")) {
                document.getElementById(enPassantWhite.empty).setAttribute("class", "empty");
            }
            enPassantWhite = {
                empty: "",
                current: "",
                turn: 0
            };
        }

    }

}

function validLocation(givenMoveArray) {
    for (let k = 0; k < givenMoveArray.length; k++) {
        if (givenMoveArray[k] < 11 || givenMoveArray[k] > 88) {
            givenMoveArray.splice(k, 1);
        } else {
            for (let l = 0; l < invalidSpaces.length; l++) {
                if (givenMoveArray[k] == invalidSpaces[l]) {
                    givenMoveArray.splice(k, 1);
                }
            }
        }
    }
}

initGameBoard();
resetPieces();