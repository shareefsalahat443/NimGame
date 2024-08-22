import React, { useState } from 'react';
import './App.css';
import NimGame from './GameLogic/NimGame';
import { bestMove } from './AlphaBeta/AlphaBeta';

function App() {
  const [numHeaps, setNumHeaps] = useState(5);
  const [heapConfig, setHeapConfig] = useState(Array.from({ length: 5 }, (_, i) => 2 * i + 1));
  const [difficulty, setDifficulty] = useState('Medium');
  const [game, setGame] = useState(null);
  const [selectedHeap, setSelectedHeap] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [onStartUpHeap, setOnStartupHeap] = useState(Array.from({ length: 5 }, (_, i) => 2 * i + 1));
  const initialSelectionState = heapConfig.map(heapSize => Array(heapSize).fill(false));
  const [objectSelections, setObjectSelections] = useState(initialSelectionState);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameMode, setGameMode] = useState('normal');

  const toggleObjectSelection = (heapIndex, objectIndex) => {
    const newSelections = objectSelections.map(heap => heap.slice());
  
    if (selectedHeap !== null && selectedHeap !== heapIndex) {
      newSelections.forEach((heap, index) => {
        if (index !== heapIndex) {
          heap.fill(false);
        }
      });
    }
  
    newSelections[heapIndex][objectIndex] = !newSelections[heapIndex][objectIndex];
  
    setSelectedHeap(heapIndex);
    setObjectSelections(newSelections);
  };
  
  const handleModeChange = (e) => {
    setGameMode(e.target.value);
  };

  const renderGameObjects = (heap, heapIndex) => {
    return Array.from({ length: heap }).map((_, objectIndex) => (
      <div
        key={objectIndex}
        className={`object ${objectSelections[heapIndex][objectIndex] ? 'selected' : ''}`}
        onClick={() => toggleObjectSelection(heapIndex, objectIndex)}
      ></div>
    ));
  };

  const letAiPlayFirst = () => {
    if (!isGameStarted) return;
    setCurrentPlayer(2);
    setIsGameStarted(false);
    const aiDepth = difficulty === 'Easy' ? 1 : (difficulty === 'Medium' ? 3 : 5);
    const aiMove = bestMove(game, aiDepth);
    game.makeMove(aiMove.heapIndex, aiMove.removeCount);
    setGame(new NimGame(game.heaps));
    setCurrentPlayer(1);
  }

  const startGame = () => {
    setGame(new NimGame(heapConfig, gameMode));
    setIsGameStarted(true);
    setObjectSelections(heapConfig.map(heapSize => Array(heapSize).fill(false)));
  };  


  const restartGame = () => {
    const startUp = Object.assign({}, onStartUpHeap);
    setHeapConfig(startUp);
    setGame(new NimGame(heapConfig));
    setSelectedHeap(null);
    setIsGameStarted(true);
    setObjectSelections(heapConfig.map(heapSize => Array(heapSize).fill(false)));
  };

  const resetGame = () => {
    setGame(null);
    setHeapConfig(Array.from({ length: 5 }, (_, i) => 2 * i + 1));
    setObjectSelections(heapConfig.map(heapSize => Array(heapSize).fill(false)));
    setIsGameStarted(false);
    setCurrentPlayer(1);
  };

  const getWinnerName = () => {
    return currentPlayer === 1 ? "Player" : "AI";
  };

  const handleHeapConfigChange = (index, value) => {
    const newConfig = [...heapConfig];
    newConfig[index] = Math.max(1, parseInt(value) || 0);
    setHeapConfig(newConfig);
    setOnStartupHeap(newConfig);
  };

  const handleNumHeapsChange = (value) => {
    const newNumHeaps = Math.max(1, parseInt(value) || 0);
    const currentHeapConfigLength = heapConfig.length;
    let newHeapConfig = [...heapConfig];
  
    if (newNumHeaps > currentHeapConfigLength) {
      newHeapConfig = newHeapConfig.concat(Array(newNumHeaps - currentHeapConfigLength).fill(3));
    } else if (newNumHeaps < currentHeapConfigLength) {
      newHeapConfig = newHeapConfig.slice(0, newNumHeaps);
    }
  
    setNumHeaps(newNumHeaps);
    setHeapConfig(newHeapConfig);
  };
  
  const handleRemoveObjects = () => {
    try {
      if (selectedHeap != null) {
        const removeCount = objectSelections[selectedHeap].filter(selected => selected).length;
  
        if (removeCount > 0) {
          if(gameMode === 'rule')
          {
            if(!game.isMoveValid(selectedHeap, removeCount)) {
              alert("Invalid move. Remember the odd-even and maximum removal rules.");
              return;
            }
          }
          game.makeMove(selectedHeap, removeCount);
          setGame(new NimGame(game.heaps));
  
          const newSelections = objectSelections.map(heap => heap.slice());
          newSelections[selectedHeap].fill(false);
          setObjectSelections(newSelections);

          setSelectedHeap(null);
          setCurrentPlayer(2);
          if (!game.isGameOver()) {
            setTimeout(() => {
              const aiDepth = difficulty === 'Easy' ? 1 : (difficulty === 'Medium' ? 3 : 5);
              const aiMove = bestMove(game, aiDepth);
              game.makeMove(aiMove.heapIndex, aiMove.removeCount);
              setGame(new NimGame([...game.heaps], game.mode));
            }, 500);
          }
        } else {
          alert("No objects selected.");
        }
      } else {
        alert("No heap selected.");
      }
      if(!game.isGameOver())
        setCurrentPlayer(1);
    } catch (error) {
      alert(error.message);
    }
  };
  
  const gameOver = () => {
    resetGame();
    alert(`Game Over!  Winner: ${getWinnerName()}`);
  }

  return (
    <div className="App">
      <header className="game-header">
        {game && (
          <>
            <button className="ai-first-button" onClick={letAiPlayFirst} disabled={!isGameStarted}>
               Let AI Play First
            </button>
            <button className="restart-button" onClick={restartGame}>Restart Game</button>
            <button className="reset-button" onClick={resetGame}>Reset Game</button>
          </>
        )}
      </header>
      <h1>Nim Game</h1>
      {!game ? (
        <div className="game-settings">
          <div className="settings-section">
            <label>
              Number of Heaps:
              <input
                type="number"
                value={numHeaps}
                onChange={(e) => handleNumHeapsChange(e.target.value)}
                min="1"
              />
            </label>
          </div>
          {heapConfig.map((heapSize, index) => (
            <div key={index} className="settings-section">
              <label>
                Heap {index + 1} objects:
                <input
                  type="number"
                  value={heapSize}
                  onChange={(e) => handleHeapConfigChange(index, e.target.value)}
                  min="1"
                />
              </label>
            </div>
          ))}
          <div className="settings-section">
            <label>
              Difficulty:
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
            <div className="mode-selection">
              <label>
                Select Game Mode:
                <select value={gameMode} onChange={handleModeChange}>
                  <option value="normal">Normal Mode</option>
                  <option value="rule">Rule Mode</option>
                </select>
              </label>
            </div>
          </div>
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div className="game-area">
          <div className="game-board">
          {game.heaps.map((heap, heapIndex) => (
            <div key={heapIndex} className="heap">
            {renderGameObjects(heap, heapIndex)}
          </div>
          ))}

          </div>
          {selectedHeap != null && (
            <div className="remove-objects-section">
              <label>
                Remove objects from Heap {selectedHeap + 1}
              </label>
              <button onClick={handleRemoveObjects}>Remove Objects</button>
            </div>
          )}
          {game && gameMode === 'rule' && (
            <div className="rules">
            <h2>Game Rules</h2>
            <ul>
              <li>Maximum 3 objects can be removed per turn.</li>
            </ul>
            <div className="turn-info">
              <span style={{ color: 'red' }}>
                {game?.isOddTurn ? 'Remove an Odd number of objects' : 'Remove an Even number of objects'}
              </span>
            </div>
          </div>
          )}
        {game && game.isGameOver() && ( 
        <div>
          {gameOver()}
        </div>
      )}
        </div>
      )}
    </div>
  );
}

export default App;
