import React, { useCallback, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.scss';

enum DirectionType {
  Left = 37,
  Right = 39,
  Up = 38,
  Down = 40,
}
const randomInRange = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

function App() {
  const [cells, setCells] = useState<Record<number, number>>(Object.fromEntries(
    Array(16).fill(0).map((_, index) => ([index, 0]))
  ))
  const [largestValue, setLargestValue] = useState<number>(2)

  const containerRef = useRef<HTMLDivElement>(null)

  const generateNewTile = (pos: number, value: number, hasAnimation?: boolean) => {
    if (containerRef.current && value) {
      const col = Math.floor(pos / 4)
      const row = pos % 4
      const left = row * 10 + 0.5
      const top = col * 10 + 0.5
      const tileEl = document.createElement('div')
      tileEl.className = `number-cell number-cell-${value}`
      tileEl.innerText = value ? value.toString() : ""

      tileEl.setAttribute('style', `left: ${left}vmin; top: ${top}vmin;${!hasAnimation ? 'animation: none' : ''}`)
      tileEl.setAttribute('position', `${pos}`)
      containerRef.current?.appendChild(tileEl)
    }
  }

  const isAbleToExecute = (newMap: Record<number, number>) => {
    return JSON.stringify(newMap) !== JSON.stringify(cells)
  }

  const generateNewRandomTile = (_cells?: Record<number, number>) => {
    const cellValue = _cells ?? cells
    // set value for tile
    let tileValue = 2
    if (randomInRange(1, 100) === 50 && largestValue >= 64) {
      tileValue = 4
    }

    // get empty cells
    const emptyCells = Object.entries(cellValue).filter(cell => !cell[1]).map(cell => Number(cell[0] ?? 0))

    // choose cell to show tile
    let random 
    while (random === undefined) {
      random = emptyCells[randomInRange(0, emptyCells.length - 1)]
    }
    const cellToShow = random 
    if (containerRef) {
      setCells({...(cellValue), [cellToShow]: tileValue})
      generateNewTile(cellToShow, tileValue, true)
    }
  }

  const generateNewMap = async (_cells: Record<number, number>, hasAnimateList: Record<number, boolean>) => {
    const entries = Object.entries(_cells)

    // start set new left & top for every entries for animation here
    // edit here
    // end 

    // wait for 0.3s (animation finished) then run these
    // edit here
    const listNumberCell = document.getElementsByClassName('number-cell')
    while (listNumberCell[0]) {
      listNumberCell[0].parentNode?.removeChild(listNumberCell[0])
    }
    
    for (let i = 0; i < entries.length; i++) {
      generateNewTile(Number(entries[i][0]), entries[i][1], hasAnimateList[Number(entries[i][0])])
    }

    generateNewRandomTile(_cells)
    // end
  }

  const handlePressLeft = useCallback(() => {
    const currenCells = Object.keys(cells).filter(key => cells[Number(key)] !== 0)
    const newMap: Record<number, number> = {}
    let map = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    currenCells.forEach(key => {
      const col = Number(key) % 4
      const row = Math.floor(Number(key) / 4)
      map[row][col] = cells[Number(key)] 
    })
    
    // move all value to the left
    for (let row = 0; row < 4; row++) {
      let newPos = 0
      for (let col = 0; col < 4; col++) {
        if (map[row][col] > 0) {
          map[row][newPos] = map[row][col]
          if (col !== newPos) {
            map[row][col] = 0
          }
          newPos++
        } else {
          map[row][col] = 0
        }
      }
    }

    const hasAnimateCoordinate: Record<number, number> = {}
    const hasAnimateMap: Record<number, boolean> = {}

    // sum closest values from left to right
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (map[row][col] === map[row][col + 1] && !!map[row][col]) {
          map[row][col] = map[row][col] + map[row][col + 1]
          map[row][col + 1] = 0 
          hasAnimateCoordinate[row] = col
        }
      }
    }

    // move all value to the left again
    for (let row = 0; row < 4; row++) {
      let newPos = 0
      for (let col = 0; col < 4; col++) {
        if (!!map[row][col]) {
          map[row][newPos] = map[row][col]
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[row * 4 + newPos] = true
          }
          newMap[row * 4 + newPos] = map[row][col]
          if (col !== newPos) {
            map[row][col] = 0
            newMap[row * 4 + col] = 0 
          }
          newPos++
        } else {
          newMap[row * 4 + col] = map[row][col] ?? 0
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[row * 4 + col] = true
          }
        }
      }
    }

    if (isAbleToExecute(newMap)) {
      setCells(newMap)
      generateNewMap(newMap, hasAnimateMap)
      console.log('press left result: ')
      console.log(map)
    }
  }, [cells, generateNewMap, generateNewRandomTile, isAbleToExecute, setCells])

  const handlePressUp = useCallback(() => {
    const currenCells = Object.keys(cells).filter(key => cells[Number(key)] !== 0)
    const newMap: Record<number, number> = {}
    let map = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    currenCells.forEach(key => {
      const col = Number(key) % 4
      const row = Math.floor(Number(key) / 4)
      map[row][col] = cells[Number(key)] 
    })
    
    // move all value to the top
    for (let col = 0; col < 4; col++) {
      let newPos = 0
      for (let row = 0; row < 4; row++) {
        if (map[row][col] > 0) {
          map[newPos][col] = map[row][col]
          if (row !== newPos) {
            map[row][col] = 0
          }
          newPos++
        } else {
          map[row][col] = 0
        }
      }
    }

    const hasAnimateCoordinate: Record<number, number> = {}
    const hasAnimateMap: Record<number, boolean> = {}

    // sum closest values from top to bottom 
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (map[row][col] === map[row + 1][col] && !!map[row][col]) {
          map[row][col] = map[row][col] + map[row + 1][col]
          map[row + 1][col] = 0 
          hasAnimateCoordinate[row] = col
        }
      }
    }

    // move all value to the top again
    for (let col = 0; col < 4; col++) {
      let newPos = 0
      for (let row = 0; row < 4; row++) {
        if (map[row][col] > 0) {
          map[newPos][col] = map[row][col]
          newMap[newPos * 4 + col] = map[row][col]
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[newPos * 4 + col] = true
          }
          if (row !== newPos) {
            map[row][col] = 0
            newMap[row * 4 + col] = 0 
          }
          newPos++
        } else {
          newMap[row * 4 + col] = map[row][col]
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[row * 4 + col] = true
          }
        }
      }
    }

    if (isAbleToExecute(newMap)) {
      setCells(newMap)
      generateNewMap(newMap, hasAnimateMap)
      console.log('press up result: ')
      console.log(map)
    }
  }, [cells, generateNewMap, generateNewRandomTile, isAbleToExecute, setCells])

  const handlePressRight = useCallback(() => {
    const currenCells = Object.keys(cells).filter(key => cells[Number(key)] !== 0)
    const newMap: Record<number, number> = {}
    let map = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    currenCells.forEach(key => {
      const col = Number(key) % 4
      const row = Math.floor(Number(key) / 4)
      map[row][col] = cells[Number(key)] 
    })
    
    // move all value to the right 
    for (let row = 0; row < 4; row++) {
      let newPos = 3 
      for (let col = 3; col >= 0; col--) {
        if (map[row][col] > 0) {
          map[row][newPos] = map[row][col] ?? 0
          if (col !== newPos) {
            map[row][col] = 0
          }
          newPos--
        } else {
          map[row][col] = 0
        }
      }
    }

    const hasAnimateCoordinate: Record<number, number> = {}
    const hasAnimateMap: Record<number, boolean> = {}
    // sum closest values from right to left 
    for (let row = 0; row < 4; row++) {
      for (let col = 3; col > 0; col--) {
        if (map[row][col] === map[row][col - 1] && !!map[row][col]) {
          map[row][col] = map[row][col] + map[row][col - 1]
          map[row][col - 1] = 0 
          hasAnimateCoordinate[row] = col
        }
      }
    }

    // move all value to the right again
    for (let row = 0; row < 4; row++) {
      let newPos = 3 
      for (let col = 3; col >= 0; col--) {
        if (map[row][col] > 0) {
          map[row][newPos] = map[row][col] ?? 0
          newMap[row * 4 + newPos] = map[row][col]
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[row * 4 + newPos] = true
          }
          if (col !== newPos) {
            map[row][col] = 0
            newMap[row * 4 + col] = 0 
          }
          newPos--
        } else {
          newMap[row * 4 + col] = map[row][col]
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[row * 4 + col] = true
          }
        }
      }
    }

    if (isAbleToExecute(newMap)) {
      setCells(newMap)
      generateNewMap(newMap, hasAnimateMap)
      console.log('press right result: ')
      console.log(map)
    }
  }, [cells, generateNewMap, generateNewRandomTile, isAbleToExecute, setCells])
  
  const handlePressDown = useCallback(() => {
    const currenCells = Object.keys(cells).filter(key => cells[Number(key)] !== 0)
    const newMap: Record<number, number> = {}
    let map = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    currenCells.forEach(key => {
      const col = Number(key) % 4
      const row = Math.floor(Number(key) / 4)
      map[row][col] = cells[Number(key)] 
    })
    
    // move all value to the bottom 
    for (let col = 0; col < 4; col++) {
      let newPos = 3 
      for (let row = 3; row >= 0; row--) {
        if (map[row][col] > 0) {
          map[newPos][col] = map[row][col]
          if (row !== newPos) {
            map[row][col] = 0
          }
          newPos--
        } else {
          map[row][col] = 0
        }
      }
    }
    
    const hasAnimateCoordinate: Record<number, number> = {}
    const hasAnimateMap: Record<number, boolean> = {}

    // sum closest values from bottom to top 
    for (let col = 0; col < 4; col++) {
      for (let row = 3; row > 0; row--) {
        if (map[row][col] === map[row - 1][col] && !!map[row][col]) {
          map[row][col] = map[row][col] + map[row - 1][col]
          map[row - 1][col] = 0 
          hasAnimateCoordinate[row] = col
        }
      }
    }

    // move all value to the bottom again
    for (let col = 0; col < 4; col++) {
      let newPos = 3 
      for (let row = 3; row >= 0; row--) {
        if (map[row][col] > 0) {
          map[newPos][col] = map[row][col]
          newMap[newPos * 4 + col] = map[row][col]
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[newPos * 4 + col] = true
          }
          if (row !== newPos) {
            map[row][col] = 0
            newMap[row * 4 + col] = 0 
          }
          newPos--
        } else {
          newMap[row * 4 + col] = map[row][col]
          if (hasAnimateCoordinate[row] === col) {
            hasAnimateMap[row * 4 + col] = true
          }
        }
      }
    }

    if (isAbleToExecute(newMap)) {
      setCells(newMap)
      generateNewMap(newMap, hasAnimateMap)
      console.log('press down result: ')
      console.log(map)
    }
  }, [cells, generateNewMap, generateNewRandomTile, isAbleToExecute, setCells])

  // handle key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => { 
      if (Object.values(DirectionType).includes(e.keyCode)) {
        switch (e.keyCode) {
          case DirectionType.Left:
            handlePressLeft()
            break 
          case DirectionType.Up:
            handlePressUp()
            break
          case DirectionType.Right:
            handlePressRight()
            break
          default:
            handlePressDown()
            break
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [cells])

  // init tiles 
  useEffect(() => {
    generateNewRandomTile()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div ref={containerRef} className="container flex flex-wrap">
          {new Array(16).fill("").map((_, index) =>(
            <div className="cell" key={index}>
              &nbsp;
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
