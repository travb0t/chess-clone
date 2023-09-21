




function initGameBoard() {

    let gameBoard = document.getElementById("gameBoard");

    for (let i = 0; i < 8; i++) {

        let Row = document.createElement("div");
        Row.className = "boardRow";

        for (let j = 0; j< 8; j++) {

            let column = document.createElement("div");
            column.className = "boardColumn";

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

            Row.appendChild(column);
        }

        gameBoard.appendChild(Row);

    }

}

initGameBoard();