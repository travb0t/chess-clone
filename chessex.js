

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

let allPossibleMoves = [];
let whitePossibilities;
let blackPossibilities;
let forCheck = 0;
let forCheckMate = 0;
let kingEscape;
let inCheckBlack = 0;
let inCheckWhite = 0;
let attackerArray = [];
let defenderArray = [];

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
        // console.log("pawn");
        let moveDist;
    
        if (currentPiece.color == "black") {
            moveDist = 1;
            if (currentPiece.location[1] == 2) {
                specialMove = 1;
                if (forCheck != 1) {
                    enPassantBlack.empty = startingLocation + moveDist;
                    enPassantBlack.current = startingLocation + moveDist + specialMove;
                }
            }
        } else if (currentPiece.color == "white") {
            moveDist = -1;
            if (currentPiece.location[1] == 7) {
                specialMove = -1;

                if (forCheck != 1) {
                    enPassantWhite.empty = startingLocation + moveDist;
                    enPassantWhite.current = startingLocation + moveDist + specialMove;
                }
            }
        }
    
        if (forCheck != 1 || forCheckMate == 1) {

            possibleMoves.push(startingLocation + moveDist);

            if (specialMove !== 0) {
                possibleMoves.push(startingLocation + moveDist + specialMove);    
            }

        }


        for (let i = 0; i < possibleMoves.length; i++) {
            if (document.getElementById(possibleMoves[i]).getAttribute("class") != "empty") {
                possibleMoves.splice(i, 2);
            }
        }

        tempMoveArray.push(startingLocation + moveDist - 10);
        tempMoveArray.push(startingLocation + moveDist + 10);
        tempMoveArray = validLocation(tempMoveArray);
        // console.log(tempMoveArray);

        if (forCheckMate != 1) {
            for (let i = 0; i < tempMoveArray.length; i++) {  
                let pawnAttack = document.getElementById(tempMoveArray[i]);
                if (currentPiece.color == "black") {
                    if (pawnAttack.classList.contains("white") || forCheck == 1) {
                        possibleMoves.push(tempMoveArray[i]);
                    }
                } else if (currentPiece.color == "white") {
                    if (pawnAttack.classList.contains("black")  || forCheck == 1) {
                        possibleMoves.push(tempMoveArray[i]);
                    }
                }
            }
        }

        possibleMoves = validLocation(possibleMoves);

    } else if (currentPiece.type == "rook") {
        // console.log("rook");

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 8; j++) {
                tempMove = startingLocation + (directionSet[i] * (j+1));

                tempMoveArray.push(tempMove);

                tempMoveArray = validLocation(tempMoveArray);

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

        possibleMoves = validLocation(possibleMoves);
        // console.log(possibleMoves);

    } else if (currentPiece.type == "knight") {
        // console.log("knight");

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {

                if (directionSet[i] > 1 || directionSet[i] < -1) {
                    tempMoveArray.push(startingLocation + (directionSet[i] * 2) + (directionSet[j]));
                } else {
                    tempMoveArray.push(startingLocation + (directionSet[i] * 2) + (directionSet[j+2]));
                }

                tempMoveArray = validLocation(tempMoveArray);
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
        // console.log("bishop");

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 8; k++) {
                    tempMove = startingLocation + (directionSet[i] * (k+1)) + (directionSet[j+2] * (k+1));
    
                    tempMoveArray.push(tempMove);
    
                    tempMoveArray = validLocation(tempMoveArray);
    
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
        }

        possibleMoves = validLocation(possibleMoves);
        // console.log(possibleMoves);

    } else if (currentPiece.type == "queen") {
        // console.log("queen");

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 8; j++) {
                tempMove = startingLocation + (directionSet[i] * (j+1));

                tempMoveArray.push(tempMove);

                tempMoveArray = validLocation(tempMoveArray);

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

        tempMoveArray = [];

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 8; k++) {
                    tempMove = startingLocation + (directionSet[i] * (k+1)) + (directionSet[j+2] * (k+1));
    
                    tempMoveArray.push(tempMove);
    
                    tempMoveArray = validLocation(tempMoveArray);
    
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
        }

        possibleMoves = validLocation(possibleMoves);
        // console.log(possibleMoves);

    } else if (currentPiece.type == "king") {
        // console.log("king");

        for (let i = 0; i < 2; i++) {

            tempMove = startingLocation + directionSet[i];
            tempMoveArray.push(tempMove);

            for (let j = 0; j < 2; j++) {
                tempMove = startingLocation + directionSet[i] + (directionSet[j+2]);
                tempMoveArray.push(tempMove);
            }

            tempMove = startingLocation + directionSet[i+2];
            tempMoveArray.push(tempMove);
        }
        // console.log(tempMoveArray);
        tempMoveArray = validLocation(tempMoveArray);
        // console.log(tempMoveArray);

        for (let k = 0; k < tempMoveArray.length; k++) {
            if (tempMoveArray.length != 0) {
                if (document.getElementById(tempMoveArray[k]).getAttribute("class") != currentPiece.color) {
                    if (!allPossibleMoves.includes(tempMoveArray[k])) {
                        possibleMoves.push(tempMoveArray[k]);
                    }
                    if (currentPiece.color == "white") {
                        if (!blackPossibilities.includes(tempMoveArray[k])) {
                            possibleMoves.push(tempMoveArray[k]);
                        }
                    } else if (currentPiece.color == "black") {
                        if (!whitePossibilities.includes(tempMoveArray[k])) {
                            possibleMoves.push(tempMoveArray[k]);
                        }
                    }
                }
            } else {
                return;
            }
        }

        possibleMoves = validLocation(possibleMoves);

        if (forCheckMate == 1) {
            kingEscape = Array.from(possibleMoves);
        }

    }

    // console.log(possibleMoves);

    if (forCheck == 1) {

        if (possibleMoves.length != 0) {
            for (let i = 0; i < possibleMoves.length; i++) {
                allPossibleMoves.push(possibleMoves[i]);
            }
        }

        if (forCheckMate != 1) {
            if (currentPiece.color == "white") {
                whitePossibilities = Array.from(allPossibleMoves);
            } else if (currentPiece.color == "black") {
                blackPossibilities = Array.from(allPossibleMoves);
            }
        }

    } else {

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

}

function movePiece(potentialMove) {

    if (potentialMove.style.backgroundColor == "rgba(255, 255, 0, 0.6)") {

        let lastPiece;
        let potentialSpaceData = {
            color: "",
            source: ""
        };

        let passantSpace = "";

        let checkColor;

        let tempPiece = {
            type: currentPiece.type,
            color: currentPiece.color,
            location: currentPiece.location,
            source: currentPiece.source
        }

        let checkMateArray = [];

        if (tempPiece.color == "black") {
            checkColor = "white";
        } else if (tempPiece.color == "white") {
            checkColor = "black";
        }

        if (tempPiece.type == "pawn" && tempPiece.color == "white" && potentialMove.getAttribute("id") == enPassantBlack.empty) {
            lastPiece = document.getElementById(enPassantBlack.current);
            passantSpace = document.getElementById(tempPiece.location);
        } else if (tempPiece.type == "pawn" && tempPiece.color == "black" && potentialMove.getAttribute("id") == enPassantWhite.empty) {
            lastPiece = document.getElementById(enPassantWhite.current);
            passantSpace = document.getElementById(tempPiece.location);
        } else {
            lastPiece = document.getElementById(tempPiece.location);
        }

        potentialSpaceData.color = potentialMove.getAttribute("class");
        potentialSpaceData.source = potentialMove.getAttribute("src");

        potentialMove.setAttribute("class", tempPiece.color);
        potentialMove.setAttribute("src", tempPiece.source);

        lastPiece.setAttribute("class", "empty");
        lastPiece.removeAttribute("src");

        if (checkColor == "white") {
            inCheckBlack = checkForCheck(checkColor);
        } else if (checkColor == "black") {
            inCheckWhite = checkForCheck(checkColor);
        }
        
        if ((tempPiece.color == "black" && inCheckBlack == 1) || (tempPiece.color == "white" && inCheckWhite == 1)) {
            
            potentialMove.setAttribute("class", potentialSpaceData.color);

            if (potentialSpaceData.source != null) {
                potentialMove.setAttribute("src", potentialSpaceData.source);
            } else {
                potentialMove.removeAttribute("src");
            }

            lastPiece.setAttribute("class", tempPiece.color);
            lastPiece.setAttribute("src", tempPiece.source);

            return;

        } else {
            let parent = lastPiece.parentNode;
            parent.removeChild(lastPiece);
            parent.appendChild(lastPiece);
        }

        if (tempPiece.type == "pawn" && tempPiece.color == "black" && potentialMove.getAttribute("id")[1] == 4 && tempPiece.location[1] == 2) {
            document.getElementById(enPassantBlack.empty).setAttribute("class", tempPiece.color);
            enPassantBlack.turn = turnCount;
        } else if (tempPiece.type == "pawn" && tempPiece.color == "white" && potentialMove.getAttribute("id")[1] == 5 && tempPiece.location[1] == 7) {
            document.getElementById(enPassantWhite.empty).setAttribute("class", tempPiece.color);
            enPassantWhite.turn = turnCount;
        }

        if (passantSpace !== "") {
            passantSpace.setAttribute("class","empty");
            passantSpace.setAttribute("src", "");
            passantSpace.removeAttribute("src");
        }

        // checkForCheck(tempPiece.color);

        
        if (tempPiece.color == "white") {
            inCheckBlack = checkForCheck(tempPiece.color);
        } else if (tempPiece.color == "black") {
            inCheckWhite = checkForCheck(tempPiece.color);
        }
        forCheckMate = 1;
        if (tempPiece.color == "white") {
            inCheckWhite = checkForCheck(checkColor);
        } else if (tempPiece.color == "black") {
            inCheckBlack = checkForCheck(checkColor);
        }
        forCheckMate = 0;

        // console.log(attackerArray);
        // console.log(defenderArray);
        console.log(inCheckWhite);

        if (inCheckBlack == 1 || inCheckWhite == 1) {

            for (let i = 0; i < attackerArray.length; i++) {
                if (defenderArray.includes(attackerArray[i])) {
                    checkMateArray.push(attackerArray[i]);
                }
            }

            checkMateArray = [...new Set(checkMateArray)];

            if (checkMateArray.length != 0) {
                for (let j = 0; j < checkMateArray.length; j++) {

                    let dummyPiece = document.getElementById(checkMateArray[j]);

                    dummyPiece.setAttribute("class", checkColor);

                    if (checkColor == "white") {
                        dummyPiece.setAttribute("src", "./pieces/pawnW.png");
                    } else if (checkColor == "black") {
                        dummyPiece.setAttribute("src", "./pieces/pawnB.png");
                    }

                }   
            }

            console.log(kingEscape);

            if (kingEscape.length == 0) {

                if (tempPiece.color == "white") {
                    inCheckBlack = checkForCheck(tempPiece.color);
                    if (inCheckBlack == 1) {
                        console.log("Check mate black");
                    }
                } else if (tempPiece.color == "black") {
                    inCheckWhite = checkForCheck(tempPiece.color);
                    if (inCheckWhite == 1) {
                        console.log("Check mate white");
                    }
                }

            }

            if (checkMateArray.length != 0) {
                for (let k = 0; k < checkMateArray.length; k++) {

                    let dummyPiece = document.getElementById(checkMateArray[k]);
    
                    dummyPiece.setAttribute("class", "empty");
    
                    if (checkColor == "white") {
                        dummyPiece.removeAttribute("src");
                    } else if (checkColor == "black") {
                        dummyPiece.removeAttribute("src");
                    }
    
                }
            }
        }

        // console.log(checkMateArray);

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
    // console.log(givenMoveArray);
    let validationArray = [];
    let validationVar;
    for (let k = 0; k < givenMoveArray.length; k++) {
        validationVar = givenMoveArray[k];
        if (validationVar > 10 && validationVar < 89) {
            if (!invalidSpaces.includes(validationVar)) {
                validationArray.push(givenMoveArray[k]);
            }
        }
    }
    return validationArray;
}

function checkForCheck(givenColor) {

    let allPiecesArray;
    allPossibleMoves = [];
    forCheck = 1;
    let inCheck;
    let whoseTurn;

    allPiecesArray = document.getElementsByClassName(givenColor);

    if (turnCount % 2 == 0) {
        whoseTurn = "black";
    } else if (turnCount % 2 != 0) {
        whoseTurn = "white";
    }

    // console.log(allPiecesArray);
    // console.log(allPiecesArray.length);

    for (let i = 0; i < allPiecesArray.length; i++) {

        if (!allPiecesArray[i].hasAttribute("src")) {
            continue;
        }

        currentPiece.source = allPiecesArray[i].getAttribute("src");
        currentPiece.color = allPiecesArray[i].getAttribute("class");
        currentPiece.location = allPiecesArray[i].getAttribute("id");

        for (let j = 0; j < 6; j++) {
            if (currentPiece.source.includes(pieceName[j+3])) {
                currentPiece.type = pieceName[j+3];
            }
        }

        // console.log(currentPiece);

        setMoveRange();

    }

    for (let i = 0; i < allPossibleMoves.length; i++) {

        let kingCheck = {
            type: "",
            color: ""
        };
        
        if (document.getElementById(allPossibleMoves[i]).hasAttribute("src")) {
            kingCheck.type = document.getElementById(allPossibleMoves[i]).getAttribute("src");
            kingCheck.color = document.getElementById(allPossibleMoves[i]).getAttribute("class");
        }

        // console.log(kingCheck);

        if (kingCheck.type.includes(pieceName[4]) && kingCheck.color != givenColor) {
            console.log("check baby");
            inCheck = 1;
            break;
        } 
        else {
            inCheck = 0;
        }

    }

    if (whoseTurn == givenColor) {
        attackerArray = Array.from(allPossibleMoves);
    } else {
        defenderArray = Array.from(allPossibleMoves);
    }

    // console.log(allPossibleMoves);
    forCheck = 0;
    return inCheck;

}

initGameBoard();
resetPieces();