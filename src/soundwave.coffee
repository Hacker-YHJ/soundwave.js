{ Func, Ease } = require './functions'
_ = require './_util'

class Soundwave
  EaseFunc = 'Sine3InOut'
  # how many pixels per points
  constructor: (@canvas) ->
    @tick = 0
    @analyserNode = null
    @funcs = []
    @ctx = @canvas.getContext '2d'
    if window? then window.addEventListener 'resize', @onResize
    @onResize()

  addWave: (obj) =>
    throw TypeError "no such type: #{obj?.type}" unless Func[obj?.type]?
    unless Number.isFinite obj.speed
      throw TypeError "speed should be a number but got #{obj.speed}"
    unless Number.isFinite obj.waveLength
      throw TypeError "waveLength should be a number but got #{obj.waveLength}"
    unless Number.isFinite obj.amplitude
      throw TypeError "amplitude should be a number but got #{obj.amplitude}"
    unless Number.isFinite obj.shift
      throw TypeError "shift should be a number but got #{obj.shift}"
    @funcs.push Func[obj.type](obj.speed, obj.waveLength, obj.amplitude, obj.shift)

  calc: =>
    ++@tick
    window.requestAnimationFrame @paint

  connect: (analyserNode) =>
    @analyserNode = analyserNode
    @analyserDataArray = new Uint8Array(1 << 10)

  paint: =>
    if @analyserNode?
      @analyserNode.getByteFrequencyData @analyserDataArray
      easing = Ease.fromFrequencyArray @canvas.width, @analyserDataArray
    else
      easing = @ease
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height
    @funcs.forEach (func, i) =>
      @ctx.beginPath()
      j = 0
      @ctx.moveTo j, @projector easing(j, func(j, @tick))
      while ++j < @canvas.width
        @ctx.lineTo j, @projector easing(j, func(j, @tick))
      @ctx.stroke()
    nextTick @calc

  start: => @calc()

  onResize: =>
    rect = @canvas.getBoundingClientRect()
    @canvas.width = rect.width
    @canvas.height = rect.height
    @ctx.lineWidth = 1
    @ctx.strokeStyle = 'rgba(0, 0, 0, .4)'
    @projector = _.createProjectToCanvas @canvas.height
    @ease = Ease[EaseFunc] @canvas.width

module.exports = Soundwave
