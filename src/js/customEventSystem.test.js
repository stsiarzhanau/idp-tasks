import CustomEventEmitter from './customEventSystem'

const emitter = new CustomEventEmitter()

const in1 = {}
const out1 = { foo: 'bar' }
emitter.on('setFoo', (data) => { in1.foo = data })
emitter.emit('setFoo', 'bar')

describe('сustom event system', () => {
  it('runs registered callback when event is emitted', function () {
    expect(in1).to.deep.equal(out1)
  })
})
