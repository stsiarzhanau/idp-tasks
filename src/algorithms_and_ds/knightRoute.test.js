import _uniq from 'lodash/uniq'
import findKnightRoute, { createBoard } from './knightRoute'

/**
 * NOTE: findKnightRoute works for board sizes from 5 to 10.
 * If size is odd then it founds route starting not from any square.
 */

const boardSize = 8 // (5), 6, (7), 8, (9), 10
const startSquare = 'A1'

describe('#createBoard()', () => {
  it('creates graph representation of chess board of given size', function () {
    // edge count is half-sum of vertices degrees (possible moves count)
    const calcEdgesCount = (size) => {
      // eslint-disable-next-line max-len
      const count = (4 * 2 + 8 * 3 + ((size - 4) * 4 + 4) * 4 + ((size - 4) * 4) * 6 + ((size - 4) ** 2) * 8) / 2
      // eslint-disable-next-line no-console
      console.log('Edges count: ', count)
      return count
    }

    if (boardSize <= 10) {
      const board = createBoard(boardSize)
      const edgeCount = calcEdgesCount(boardSize)
      expect(board.getAllVertices().length).to.equal(boardSize ** 2)
      expect(board.getAllEdges().length).to.equal(edgeCount)
    }
  })
})

describe('#findKnightRoute()', () => {
  it('creates route for knigth in which every field is visited just once', function () {
    this.timeout(100000)
    const { visitedVertexKeys } = findKnightRoute(boardSize, startSquare)
    expect(_uniq(visitedVertexKeys).length).to.equal(boardSize ** 2)
  })
})
