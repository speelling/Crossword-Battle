export function checkCrosswordCompletion(gameState: any, userId: string): boolean {
    const playerPuzzle = gameState.playerStates[userId].puzzle;
    const fullPuzzle = gameState.puzzle; 

    console.log("CHECKCOMPLETE")
    console.log(playerPuzzle)
    console.log(fullPuzzle)
  
    for (let i = 0; i < playerPuzzle.length; i++) {
      if (playerPuzzle[i].isBlack) continue;
      if (
        playerPuzzle[i].value.toUpperCase() !==
        fullPuzzle[i].answer.toUpperCase()
      ) {
        return false;
      }
    }
  
    return true;
  }