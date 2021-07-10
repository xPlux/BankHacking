import { randomInt, sample } from './helpers.js'

const SHAPES = ["kwadrat", "trójkąt", "prostokąt", "koło"]
const COLORABLE = ['background', 'text', 'number', 'shape']

const COLORS = {
    'czarny' : '#000000',
    'biały' : '#FFFFFF',
    'niebieski' : '#2297F5',
    'czerwony' : '#7F0101',
    'żółty' : '#FEEC3C',
    'pomarańczowy' : '#FE9801',
    'zielony' : '#4BAF4F',
    'fioletowy' : '#9B25AE',
}
const QUESTIONS = {
    'kolor tła' : (d) => getKeyByValue(COLORS, d.colors['background']),
    'kolor tekstu' : (d) => getKeyByValue(COLORS, d.colors['text']),
    'kolor liczby' : (d) => getKeyByValue(COLORS, d.colors['number']),
    'kolor kształtu' : (d) => getKeyByValue(COLORS, d.colors['shape']),
    'kolor z tekstu' : (d) => d.text[0],
    'kształt z tekstu' : (d) => d.text[1],
    'kształt' : (d) => d.shape
}

class PuzzleData {
    constructor(shape, number, text, colors) {
      this.shape = shape
      this.number = number
      this.text = text
      this.colors = colors
    }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// generates a random puzzle
export function generateRandomPuzzle(){

    const shape = sample(SHAPES)
    const number = randomInt(9) + 1

    const topText = sample(Object.keys(COLORS))
    const bottomText = sample(SHAPES)

    const colors = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.values(COLORS)); return obj}, {})

    // ensure shape and background don't blend
    while(colors['text'] == colors['background'])
        colors['text'] = sample(Object.keys(COLORS))

    // ensure nothing blends with shape
    while(['background', 'text', 'number'].map(i => colors[i]).includes(colors['shape']))
        colors['shape'] = sample(Object.keys(COLORS))
    
    return new PuzzleData(shape, number, [topText, bottomText], colors)
}


export function generateQuestionAndAnswer(nums, puzzles){

    const positionOne = randomInt(nums.length)
    let tempPosTwo
    do {tempPosTwo = randomInt(nums.length)} while(positionOne == tempPosTwo) 
    const positionTwo = tempPosTwo
    

    const firstQuestion = sample(Object.keys(QUESTIONS))
    let tempSecondQuestion
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion) 
    const secondQuestion = tempSecondQuestion

    

    // this is confusing as hell, but works somehow
    const question =  `${firstQuestion} (${nums[positionOne]}) i ${secondQuestion} (${nums[positionTwo]})`
    const answer = QUESTIONS[firstQuestion](puzzles[positionOne]) + ' ' + QUESTIONS[secondQuestion](puzzles[positionTwo])

    return [question, answer]
}
