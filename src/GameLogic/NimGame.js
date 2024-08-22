export default class NimGame {
  constructor(heaps, mode = 'normal', currentPlayer = 1, moveCount = 0, isOddTurn) {
    this.heaps = heaps;
    this.currentPlayer = currentPlayer;
    this.moveCount = moveCount;
    this.mode = mode;
    const num = Math.random();
    this.isOddTurn = num >= 0.5;
    if(isOddTurn === true || isOddTurn === false)
      this.isOddTurn = isOddTurn;
  }
  

  isMoveValid(heapIndex, removeCount) {
    console.log("valid move");
    if (this.mode === 'rule') {
      console.log("count ? " + removeCount);
      if (removeCount < 1 || removeCount > 3) {
        return false;
      }

      const isOddNumber = removeCount % 2 !== 0;
      if (this.isOddTurn !== isOddNumber) {
        console.log("special case? " + this.isSpecialCase());
        if (this.isSpecialCase()) {
          return true;
        }
        return false;
      }
    }

    return removeCount <= this.heaps[heapIndex];
  }

    makeMove(heapIndex, removeCount) {
      if (heapIndex < 0 || heapIndex >= this.heaps.length) {
        throw new Error("Invalid heap index.");
      }
  
      if (removeCount <= 0 || removeCount > this.heaps[heapIndex]) {
        throw new Error("Invalid number of objects to remove.");
      }
      
      this.heaps[heapIndex] -= removeCount;
      this.currentPlayer = 3 - this.currentPlayer;
      this.moveCount++;
      if(!this.isOddTurn)
        this.isOddTurn = true;
      else
        this.isOddTurn = !this.isOddTurn;
    }
  
    isGameOver() {
      return this.heaps.every(heap => heap === 0);
    }
  
    getWinner() {
      if (this.isGameOver()) {
        return 3 - this.currentPlayer;
      }
      return null;
    }
    

    getCurrentPlayer() {
      return 3 - this.currentPlayer;
    }

    isSpecialCase() {
      return this.heaps.every(heap => heap === 1 || heap === 0);
    }

  }
  