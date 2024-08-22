import NimGame from "../GameLogic/NimGame";

function evaluateGameState(game) {
  const xorSum = game.heaps.reduce((xor, heap) => xor ^ heap, 0);
  return xorSum !== 0 ? 1 : -1;
}

function alphaBeta(game, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateGameState(game);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let heapIndex = 0; heapIndex < game.heaps.length; heapIndex++) {
      for (let removeCount = 1; removeCount <= game.heaps[heapIndex]; removeCount++) {
        const newGame = new NimGame([...game.heaps]);
        newGame.makeMove(heapIndex, removeCount);
        const evaluation = alphaBeta(newGame, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let heapIndex = 0; heapIndex < game.heaps.length; heapIndex++) {
      for (let removeCount = 1; removeCount <= game.heaps[heapIndex]; removeCount++) {
        const newGame = new NimGame([...game.heaps]);
        newGame.makeMove(heapIndex, removeCount);
        const evaluation = alphaBeta(newGame, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}


// export function bestMove(game, depth) {
//   let bestVal = -Infinity;
//   let bestMove = null;

//   for (let heapIndex = 0; heapIndex < game.heaps.length; heapIndex++) {
//     for (let removeCount = 1; removeCount <= game.heaps[heapIndex]; removeCount++) {
//       if (game.mode === 'rule' && !game.isMoveValid(heapIndex, removeCount)) {
//         continue;
//       }

//       const newGame = new NimGame([...game.heaps], game.mode, game.currentPlayer, game.moveCount, game.isOddTurn);
//       try {
//         newGame.makeMove(heapIndex, removeCount);
//         const moveVal = alphaBeta(newGame, depth - 1, -Infinity, Infinity, false);

//         if (moveVal > bestVal) {
//           bestVal = moveVal;
//           bestMove = { heapIndex, removeCount };
//         }
//       } catch (error) {
//         // Ignore invalid moves
//       }
//     }
//   }

//   return bestMove;
// }


export function bestMove(game, depth) {
  let bestVal = -Infinity;
  let bestMove = null;
  let fallbackMove = null;

  for (let heapIndex = 0; heapIndex < game.heaps.length; heapIndex++) {
    for (let removeCount = 1; removeCount <= game.heaps[heapIndex]; removeCount++) {
      const isValidMove = game.mode === 'rule' ? game.isMoveValid(heapIndex, removeCount) : true;
      
      if (isValidMove) {
        const newGame = new NimGame([...game.heaps], game.mode, game.currentPlayer, game.moveCount, game.isOddTurn);
        newGame.makeMove(heapIndex, removeCount);
        const moveVal = alphaBeta(newGame, depth, -Infinity, Infinity, false);

        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = { heapIndex, removeCount };
        }
      } else if (!fallbackMove) {
        fallbackMove = { heapIndex, removeCount };
      }
    }
  }

  return bestMove || fallbackMove;
}
