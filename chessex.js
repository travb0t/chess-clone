

let rowArray = ["8", "7", "6", "5", "4", "3", "2", "1"];
// columnArray was formerly a-h.
let columnArray = ["1", "2", "3", "4", "5", "6", "7", "8"];
let pieceName = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook", "pawn"]
let invalidSpaces = [19, 20, 29, 30, 39, 40, 49, 50, 59, 60, 69, 70, 79, 80];

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

    if (targetPiece.classList.contains("empty")) {

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

        console.log("Empty");
        return;

    }

    currentPiece.source = targetPiece.getAttribute("src");
    currentPiece.color = targetPiece.getAttribute("class");
    currentPiece.location = targetPiece.getAttribute("id");

    for (let i = 0; i < 6; i++) {
        if (currentPiece.source.includes(pieceName[i+3])) {
            currentPiece.type = pieceName[i+3];
            console.log(currentPiece);
        }
    }

    pieceSelected = 1;
    targetPiece.style.backgroundColor = "rgba(144, 238, 144, 0.6)";

    setMoveRange();

})

function setMoveRange() {

    console.log("wooo");

    let possibleMoves = [];
    let startingLocation = Number(currentPiece.location);
    let moveDist;
    let specialMove = 0;
    
    if (currentPiece.type === "pawn") {
    
        if (currentPiece.color == "black") {
            moveDist = 1;
            if (currentPiece.location[1] == 2) {
                specialMove = 1;
            }
        } else if (currentPiece.color == "white") {
            moveDist = -1;
            if (currentPiece.location[1] == 7) {
                specialMove = -1;
            }
        }
    
        possibleMoves.push(startingLocation + moveDist);

        if (specialMove !== 0) {
            possibleMoves.push(startingLocation + moveDist + specialMove);    
        }

        let pawnAttackLocation = [];
        pawnAttackLocation.push(startingLocation + moveDist - 10);
        pawnAttackLocation.push(startingLocation + moveDist + 10);
        validLocation(pawnAttackLocation);

        for (let i = 0; i < pawnAttackLocation.length; i++) {  
            let pawnAttack = document.getElementById(pawnAttackLocation[i]);
            if (currentPiece.color == "black") {
                if (pawnAttack.classList.contains("white")) {
                    possibleMoves.push(pawnAttackLocation[i]);
                }
            } else if (currentPiece.color == "white") {
                if (pawnAttack.classList.contains("black")) {
                    possibleMoves.push(pawnAttackLocation[i]);
                }
            }
        }

        validLocation(possibleMoves);

    } else if (currentPiece.type == "rook") {
        console.log("rook");
    } else if (currentPiece.type == "knight") {
        console.log("knight");
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

function movePiece(potentialMove) {

    if (potentialMove.style.backgroundColor == "rgba(255, 255, 0, 0.6)") {

        let lastPiece = document.getElementById(currentPiece.location);

        potentialMove.setAttribute("class", currentPiece.color);
        potentialMove.setAttribute("src", currentPiece.source);

        lastPiece.setAttribute("class","empty");
        lastPiece.removeAttribute("src");

    }

}

initGameBoard();
resetPieces();