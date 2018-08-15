import _uniq from 'lodash/uniq'
import findKnightRoute, { createBoard } from './knightRoute'

const boardSize = 8 // 6, 8, 10
const startSquare = 'A2'

// const edgeCount = 168 // half-sum of vertices degrees

const board = createBoard(boardSize)

describe('#createBoard()', () => {
  it('creates graph representation of chess board of given size', function () {
    expect(board.getAllVertices().length).to.equal(boardSize ** 2)
    // expect(board.getAllEdges().length).to.equal(edgeCount)
  })
})

describe('#findKnightRoute()', () => {
  it('creates route for knigth in which every field is visited just once', function () {
    this.timeout(30000)
    const { visitedVertexKeys } = findKnightRoute(board, startSquare)
    expect(_uniq(visitedVertexKeys).length).to.equal(boardSize ** 2)
  })
})
