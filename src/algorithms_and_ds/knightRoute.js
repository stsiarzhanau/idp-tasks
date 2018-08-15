import Graph from '../3rd_party/javascript_algorithms/data_structures/graph/Graph'
import GraphEdge from '../3rd_party/javascript_algorithms/data_structures/graph/GraphEdge'
import GraphVertex from '../3rd_party/javascript_algorithms/data_structures/graph/GraphVertex'

const ROW_NAMES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const COLUMN_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const POSSIBLE_OFFSETS = [[1, -2], [1, 2], [-1, -2], [-1, 2], [2, -1], [2, 1], [-2, -1], [-2, 1]]

const getRowNames = size => ROW_NAMES.slice(0, size)
const getColumnNames = size => COLUMN_NAMES.slice(0, size)

const addVerticesAndEdges = (graph, rowNames, columnNames) => {
  rowNames.forEach((rowName, rowIndex) => {
    columnNames.forEach((columnName, columnIndex) => {
      const startVertexKey = `${columnName}${rowName}`
      let startVertex

      if (!graph.findVertexByKey(startVertexKey)) {
        startVertex = new GraphVertex(startVertexKey)
        graph.addVertex(startVertex)
      } else {
        startVertex = graph.findVertexByKey(startVertexKey)
      }

      POSSIBLE_OFFSETS.forEach(([rowOffset, columnOffset]) => {
        if (columnNames[columnIndex + columnOffset] && rowNames[rowIndex + rowOffset]) {
          const endVertexKey = `${columnNames[columnIndex + columnOffset]}${rowNames[rowIndex + rowOffset]}`
          let endVertex

          if (!graph.findVertexByKey(endVertexKey)) {
            endVertex = new GraphVertex(endVertexKey)
            graph.addVertex(endVertex)
          } else {
            endVertex = graph.findVertexByKey(endVertexKey)
          }

          if (!graph.findEdge(startVertex, endVertex)) {
            graph.addEdge(new GraphEdge(startVertex, endVertex))
          }
        }
      })
    })
  })
}

export const createBoard = (size) => {
  const rowNames = getRowNames(size)
  const columnNames = getColumnNames(size)
  const graph = new Graph()
  addVerticesAndEdges(graph, rowNames, columnNames)
  return graph
}

function findRoute(graph, startVertexKey, verticesCount, visitedVertexKeys = []) {
  const currentVertex = graph.findVertexByKey(startVertexKey)
  visitedVertexKeys.push(currentVertex.getKey())

  let done = false

  if (visitedVertexKeys.length < verticesCount) {
    const nextVertices = currentVertex.getNeighbors()
      .filter(vertex => !visitedVertexKeys.includes(vertex.getKey()))
      .sort((a, b) => a.getDegree() - b.getDegree())

    // console.log(visitedVertexKeys.length, currentVertex.getKey(), nextVertices.map(v => v.getKey()))

    nextVertices.forEach((nextV) => {
      if (!done) {
        const nextKey = nextV.getKey();
        ({ done } = findRoute(graph, nextKey, verticesCount, visitedVertexKeys))
      }
    })

    if (!done) {
      visitedVertexKeys.pop()
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Route: ', visitedVertexKeys)
    done = true
  }
  return {
    done,
    visitedVertexKeys,
  }
}

const findKnightRoute = (size, startVertexKey) => {
  const board = createBoard(size)
  const verticesCount = board.getAllVertices().length

  const [columnIndex, rowIndex] = startVertexKey.split('')
    .map((name, i) => (i === 0 ? COLUMN_NAMES.indexOf(name) : ROW_NAMES.indexOf(name)))

  if (size < 5 || size > 10) {
    throw new Error('Not supported board size. Supported size range is from 5 to 10.')
  }

  if (verticesCount % 2 !== 0 && (columnIndex + rowIndex) % 2 !== 0) {
    throw new Error(`It's impossible to build knight route for the given board starting from the given square.
     Pick another one for each sum of row number and column number is even.`)
  }
  return findRoute(board, startVertexKey, verticesCount)
}

export default findKnightRoute
