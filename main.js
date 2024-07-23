import './style.css'
import { cellColors } from './js/colors'
import { getNewMatrix, getSavedBestScore, finishGame, checkFreeCell, comparePrevMatrixValues } from './js/helpers'



window.onload = () => startDame()

const fieldElement = document.querySelector('#field')
const totalScoreElement = document.querySelector('#totalScore')
const bestScoreElement = document.querySelector('#bestScore')


const messageField = document.getElementById('messageField')
const messageTitle = document.getElementById('messageTitle')
const messageText = document.getElementById('messageText')
const buttonNewGame = document.getElementById('newGameButton')
messageField.style.display = 'none'



let fieldMatrix = []
let transposedMatrix = []
let totalScore = 0
const isChanceOfGettingNewNumber = 0.7;

const basicCellStyles = "flex items-center justify-center text-4xl font-bold rounded-md text-slate-50"

let isAvailableRightMoves = true;
let isAvailableDownMoves = true;
let isAvailableLeftMoves = true;
let isAvailableUpMoves = true;





document.addEventListener('keyup', (e) => {
    checkAvailableMoves()

    if (e.key === 'ArrowLeft') {
        moveLeft()
        if (isAvailableLeftMoves) {
            addNewBasicSell()
        }
        return
    }
    if (e.key === 'ArrowRight') {
        moveRight()
        if (isAvailableRightMoves) {
            addNewBasicSell()
        }
        return
    }
    if (e.key === 'ArrowDown') {
        moveDown()
        if (isAvailableDownMoves) {
            addNewBasicSell()
        }
        return
    }
    if (e.key === 'ArrowUp') {
        moveUp()
        if (isAvailableUpMoves) {
            addNewBasicSell()
        }
    }
})


const drawField = () => {
    fieldElement.innerHTML = ''

    fieldMatrix.flat().forEach((item) => {
        const cellDiv = document.createElement('div')

        if (item === 0) {
            cellDiv.innerText = ''
            cellDiv.classList.value = `${basicCellStyles} bg-stone-50/50`
            
        } else {
            cellDiv.innerText = item
            cellColors.forEach(data => {
                if (data.value === item) {
                    cellDiv.classList.value = `${basicCellStyles} ${data.color}`
                }
            })

            if (item === 2048) {
                finishGame('victory')
            }
        }
        fieldElement.appendChild(cellDiv)
    })

}

const startDame = () => {
    const score = getSavedBestScore()
    fieldMatrix = getNewMatrix(4)

    messageField.style.display = 'none'
    bestScoreElement.innerText = score

    addNewBasicSell()
    addNewBasicSell()
}


const addNewBasicSell = () => {
    const basicValue = Math.random() >= isChanceOfGettingNewNumber ? 4 : 2

    let foundEmpty = false
    let isAvailableFreeCells = checkFreeCell(fieldMatrix)


    while (!foundEmpty && isAvailableFreeCells) {
        let randomIndex =  Math.floor(Math.random() * 4)
        let rowIndex = randomIndex
        let colIndex = randomIndex

        if (fieldMatrix[rowIndex][colIndex] === 0) {
            fieldMatrix[rowIndex][colIndex] = basicValue
            foundEmpty = true
        }
    }
    drawField()
}


const moveLeft = () => {
    let prevMatrixValues = [...fieldMatrix]

    const updatedMatrix = makeMove(fieldMatrix, 'direct')
    fieldMatrix = updatedMatrix

    isAvailableLeftMoves = !comparePrevMatrixValues(prevMatrixValues, fieldMatrix)

    drawField()
}

const moveRight = () => {
    let prevMatrixValues = [...fieldMatrix]

    const updatedMatrix = makeMove(fieldMatrix, 'reverse')
    fieldMatrix = updatedMatrix

    isAvailableRightMoves = !comparePrevMatrixValues(prevMatrixValues, fieldMatrix)
    drawField()
}

const moveUp = () => {
    transposedMatrix = getNewMatrix(4)

    fieldMatrix.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            transposedMatrix[cellIndex][rowIndex] = cell
        })
    })

    let prevMatrixValues = [...transposedMatrix]

    const updatedMatrix = makeMove(transposedMatrix, 'direct')
    transposedMatrix = updatedMatrix

    transposedMatrix.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            fieldMatrix[cellIndex][rowIndex] = cell
        })
    })

    isAvailableUpMoves = !comparePrevMatrixValues(prevMatrixValues, transposedMatrix)
    drawField()
}

const moveDown = () => {
    transposedMatrix = getNewMatrix(4)

    fieldMatrix.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            transposedMatrix[cellIndex][rowIndex] = cell
        })
    })
    let prevMatrixValues = [...transposedMatrix]
    
    const updatedMatrix = makeMove(transposedMatrix, 'reverse')
    transposedMatrix = updatedMatrix

    transposedMatrix.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            fieldMatrix[cellIndex][rowIndex] = cell
        })
    })
    isAvailableDownMoves = !comparePrevMatrixValues(prevMatrixValues, transposedMatrix)
    drawField()
}




const makeMove = (matrix, direction) => {
    
    const updatedMatrix = matrix.map((row) => {
        let filteredRow = row.filter(item => item > 0)
        let rowValues;

        if (direction === 'reverse') {
            rowValues = filteredRow.reverse()
        } else {
            rowValues = filteredRow
        }

        let mergedRow = rowValues.map((item, index, currentRow) => {
            if(item === currentRow[index+1]) {
                return collapseCells(currentRow, index, item)
            }
            return item
        })
        let resultRow = mergedRow.filter(item => item > 0)

        while(resultRow.length < 4) {
            resultRow.push(0)
        }
        return direction === 'reverse'  ? resultRow.reverse(): resultRow
    })
    return updatedMatrix
}


const collapseCells = (currentRow, index, item) => {
    currentRow.splice(1, index + 1)
    const newValue = item * 2
    updateScores(newValue)
    return newValue
}



const checkAvailableMoves = () => {

    if (isAvailableDownMoves === false && isAvailableUpMoves === false && isAvailableLeftMoves === false  && isAvailableRightMoves === false) {
        finishGame('loss')
        buttonNewGame.addEventListener('click', startDame)
        return
    }
    buttonNewGame.removeEventListener('click', startDame)
}


const updateScores = (newVal) => {
    const bestScore = getSavedBestScore()
    totalScore += newVal
    totalScoreElement.innerText = totalScore

    if (totalScore < bestScore) return
    const newBestScore = totalScore
    bestScoreElement.innerText = totalScore
    localStorage.setItem('bestScore2048Game', JSON.stringify(newBestScore));
}