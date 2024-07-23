
export const getSavedBestScore = () => {
    const score = JSON.parse(localStorage.getItem('bestScore2048Game')) || 0
    return score
}



export const finishGame = (status) => {
    messageField.removeAttribute('style')

    messageTitle.innerText = status === "loss" ? "Game is over!" : "You won!"
    messageText.innerText = status === "loss" ? "no moves available" : "you've reached 2048 tile"
}



export const getNewMatrix = (cellsAmount) => {
    let matrix = new Array(cellsAmount)
    .fill(null)
    .map(() => new Array(cellsAmount)
    .fill(0))

    return matrix
}



export const checkFreeCell = (matrix) => {
    const isFreeCell = matrix.flat().some(item => item === 0)
    return isFreeCell
}



export const comparePrevMatrixValues = (matrixPrev, matrixCurrent) => {
    const isEqual =  matrixPrev
    .flat()
    .every((value, index) => value === matrixCurrent.flat()[index]);
    
    return isEqual
} 



