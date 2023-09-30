# chess-clone
This is a project intended to continue my journey learning javascript. My goal is to create a working PvPC game of chess. (self learning project)


Done:

- Create boilerPlate for script/style/index.
- Make script to create gameBoard.
- Add basic style to gameBoard.
- Create game pieces.
- Add addresses to each space.
- make pieces selectable.
- Highlight selected piece and remove highlight when a piece isn't selected.
- When a piece is selected highlight legal placements with yellow.
- Make a pawn able to move.
- create a turn based system that swaps control between white and black.
- create a capture mechanic.
- Add an En Passant mechanic to pawns.
- Add movement functionality to rooks.
- Change the way the image is removed from an "empty" space to use a removeChild method. *this prevents non-refresh image ghosts.*
- Add movement to Knights.
- Change movement variables to shared variables amongst all pieces.

Current tasks:
- Add movement to:
    - Bishop
    - Queen
    - King


Future To Do:
- Add ability for pawns to be exchanged for different pieces when they reach the enemy backline.
- Add check system to king.
- Add win/loss condition to game.
- Add "New Game" function.
- Clean up code:
    - Redo ID naming system to get rid of need for arrays containing the row and column numbers. *use a for...loop system instead.*
