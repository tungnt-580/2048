import React from 'react'
import Card from './Card'

function flat(arr) {
  return arr.reduce((result, ele) => result.concat(ele), [])
}

function rotate90(arr) {
  const result = []
  for (let i = 0; i < SIZE; i++) {
    result.push([])
    for (let j = 0; j < SIZE; j++) {
      result[i].push(arr[SIZE - j - 1][i])
    }
  }
  return result
}

function rotate180(arr) {
  return rotate90(rotate90(arr))
}

function rotate270(arr) {
  return rotate90(rotate180(arr))
}

function log(arr) {
  console.log('logging')
  for (let i = 0; i < SIZE; i++) {
    let str = ''
    for (let j = 0; j < SIZE; j++) {
      str += ' ' + arr[i][j]
    }
    console.log(str)
  }
}

export const SIZE = 4

export default class extends React.Component {
  constructor() {
    super()

    this.state = {
      numbers: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]
    }

    this.randomNumber = this.randomNumber.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.moveLeft = this.moveLeft.bind(this)
    this.moveUp = this.moveUp.bind(this)
    this.moveRight = this.moveRight.bind(this)
    this.moveDown = this.moveDown.bind(this)
    this.freeFall = this.freeFall.bind(this)
  }

  componentWillMount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  componentDidMount() {
    this.randomNumber()
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  randomNumber() {
    const { numbers } = this.state
    const list0 = flat(numbers).reduce((result, number, index) => {
      return number === 0? result.concat([index]) : result
    }, [])
    const randomPosition = list0[parseInt(Math.random() * list0.length)]
    const randomValue = Math.random() < 0.7? 2 : 4

    numbers[parseInt(randomPosition / SIZE)][randomPosition % SIZE] = randomValue

    this.setState({ numbers })
  }

  freeFall() {
    const { numbers } = this.state
    let stateChanged = false

    for (let c = 0; c < SIZE; c++) {
      let ground = SIZE, merged = false
      for (let r = SIZE - 1; r >= 0; r--) {
        if (numbers[r][c]) {
          if (numbers[ground] && numbers[r][c] === numbers[ground][c] && !merged) {
            numbers[ground][c] *= 2
            merged = true
          }
          else {
            numbers[--ground][c] = numbers[r][c]
            merged = false
          }
          if (!stateChanged) stateChanged = ground !== r
        }
      }
      for (let i = 0; i < ground; i++) {
        numbers[i][c] = 0
      }
    }

    return stateChanged
  }

  moveLeft() {
    this.state.numbers = rotate270(this.state.numbers)
    const result = this.freeFall()
    this.state.numbers = rotate90(this.state.numbers)
    if (result) this.randomNumber()
  }

  moveUp() {
    this.state.numbers = rotate180(this.state.numbers)
    const result = this.freeFall()
    this.state.numbers = rotate180(this.state.numbers)
    if (result) this.randomNumber()
  }

  moveRight() {
    this.state.numbers = rotate90(this.state.numbers)
    const result = this.freeFall()
    this.state.numbers = rotate270(this.state.numbers)
    if (result) this.randomNumber()
  }

  moveDown() {
    const result = this.freeFall()
    if (result) this.randomNumber()
  }

  handleKeyUp(e) {
    switch (e.keyCode) {
      case 37: // Left
        this.moveLeft()
        break
      case 38: // Up
        this.moveUp()
        break
      case 39: // Right
        this.moveRight()
        break
      case 40: //Down
        this.moveDown()
        break
    }
  }

  render() {
    const { numbers } = this.state

    return (
      <div
        style={{
          margin: 'auto',
          width: '500px',
          height: '500px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr 1fr'
        }}
      >
        {flat(numbers).map((number, index) => (
          <Card
            key={index}
            inverse={(parseInt(index / SIZE) + index % SIZE) % 2 === 0}
          >
            {number? number : ''}
          </Card>
        ))}
      </div>
    )
  }
}



