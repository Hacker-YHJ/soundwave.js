HalfPi = Math.PI / 2
PI2 = Math.PI * 2

# wave animation functions
sine = (speed, waveLength, amp, shift) ->
  values = [0...waveLength].map (e) ->
    amp * Math.sin(e * PI2 / waveLength + shift)

  (x, tick) ->
    idx = (x - tick * speed) % waveLength
    idx = (idx + waveLength) % waveLength
    values[idx]

square = (speed, waveLength, amp, shift) ->
  values = [0...waveLength].map (e) ->
    amp * (Math.floor((e / waveLength) * 2) * 2 - 1)

  (x, tick) ->
    idx = (x - tick * speed) % waveLength
    idx = (idx + waveLength) % waveLength
    values[idx]

triangle = (speed, waveLength, amp, shift) ->
  values = [0...waveLength].map (e) ->
    x = e / waveLength
    if x < 0.5
      amp * (-1 + x * 4)
    else
      amp * (3 - x * 4)

  (x, tick) ->
    idx = (x - tick * speed) % waveLength
    idx = (idx + waveLength) % waveLength
    values[idx]

easeSine3InOut = (width) ->
  value = [0..width].map (e) ->
    sinX = Math.sin((e / width) * Math.PI)
    Math.pow(sinX, 3)

  (x, y) ->
    y * value[x]

fromFrequencyArray = (width, arr) ->
  (x, y) ->
    y * arr[~~(x * arr.length / width)] / 256

module.exports =
  Func:
    sine: sine
    square: square
    triangle: triangle

  Ease:
    Sine3InOut: easeSine3InOut
    fromFrequencyArray: fromFrequencyArray
