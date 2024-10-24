export function generateCrossword() {
  const fullCrossword = {
    puzzle: [
      { answer: "", clues: [0, 5], isBlack: true, position: { x: 0, y: 0 } },
      { answer: "B", clues: [1,5], isBlack: false, position: { x: 0, y: 1 } },
      { answer: "E", clues: [2, 5], isBlack: false, position: { x: 0, y: 2 } },
      { answer: "A", clues: [3,5], isBlack: false, position: { x: 0, y: 3 } },
      { answer: "N", clues: [4,5], isBlack: false, position: { x: 0, y: 4 } },
  
      { answer: "B", clues: [0,6], isBlack: false, position: { x: 1, y: 0 } },
      { answer: "E", clues: [1,6], isBlack: false, position: { x: 1, y: 1 } },  
      { answer: "L", clues: [2,6], isBlack: false, position: { x: 1, y: 2 } },
      { answer: "L", clues: [3,6], isBlack: false, position: { x: 1, y: 3 } },
      { answer: "Y", clues: [4,6], isBlack: false, position: { x: 1, y: 4 } },  
  
      { answer: "L", clues: [0, 7], isBlack: false, position: { x: 2, y: 0 } },
      { answer: "I", clues: [1,7], isBlack: false, position: { x: 2, y: 1 } },
      { answer: "L", clues: [2, 7], isBlack: false, position: { x: 2, y: 2 } },
      { answer: "A", clues: [3,7], isBlack: false, position: { x: 2, y: 3 } },
      { answer: "C", clues: [4,7], isBlack: false, position: { x: 2, y: 4 } },
  
      { answer: "A", clues: [0,8], isBlack: false, position: { x: 3, y: 0 } },
      { answer: "G", clues: [1,8], isBlack: false, position: { x: 3, y: 1 } },  
      { answer: "E", clues: [2,8], isBlack: false, position: { x: 3, y: 2 } },
      { answer: "S", clues: [3,8], isBlack: false, position: { x: 3, y: 3 } },
      { answer: "", clues: [4,8], isBlack: true, position: { x: 3, y: 4 }},

      
      { answer: "H", clues: [0,9], isBlack: false, position: { x: 4, y: 0 } },
      { answer: "E", clues: [1,9], isBlack: false, position: { x: 4, y: 1 } },  
      { answer: "N", clues: [2,9], isBlack: false, position: { x: 4, y: 2 } },
      { answer: "", clues: [3,9], isBlack: true, position: { x: 4, y: 3 } },
      { answer: "", clues: [4,9], isBlack: true, position: { x: 4, y: 4 } }   
    ],
    clues: [
      { "clueId": 0, "direction": "down", "text": "Sad color joked about in viral tiktok videos","cells":[ [1,0],[2,0],[3,0],[4,0] ] },
      { "clueId": 1, "direction": "down", "text": "Comedian DeGeneres", "cells":[[0,1], [1,1],[2,1],[3,1],[4,1] ] },
      { "clueId": 2, "direction": "down", "text": "Tis a pity", "cells":[[0,2], [1,2],[2,2],[3,2],[4,2] ] },
      { "clueId": 3, "direction": "down", "text": "Home of moma", "cells":[[0,3], [1,3],[2,3],[3,3],[4,3] ] },
      { "clueId": 4, "direction": "down", "text": "Just kinda meh" , "cells":[[0,4], [1,4],[2,4],[3,4],[4,4] ] },
      { "clueId": 5, "direction": "across", "text": "Writing tool" , "cells":[[0,0], [0,1],[0,2],[0,3],[0,4] ] },
      { "clueId": 6, "direction": "across", "text": "Ocean animal", "cells":[[1,0], [1,1],[1,2],[1,3],[1,4] ] },
      { "clueId": 7, "direction": "across", "text": "A drink", "cells":[[2,0], [2,1],[2,2],[2,3],[2,4] ] },
      { "clueId": 8, "direction": "across", "text": "Part of a tree", "cells":[[3,0], [3,1],[3,2],[3,3],[3,4] ] },
      { "clueId": 9, "direction": "across", "text": "Home appliance", "cells":[[4,0], [4,1],[4,2],[4,3],[4,4] ] }
    ],
    dim: { rows: 5, cols: 5 }
  };
  

  const clientCrossword = {
    puzzle: fullCrossword.puzzle.map(cell => ({
      isBlack: cell.isBlack,
      position: cell.position,
      clues: cell.clues,
    })),
    clues: fullCrossword.clues,
    dim: fullCrossword.dim,
  };

  return { fullCrossword, clientCrossword };
}