window.nextTick = do ->
  if window?.setImmediate
    return window.setImmediate
  else if window?.postMessage? && window?.addEventListener?
    queue = []
    handler = (ev) ->
      source = ev.source
      if (source is window || source is null) && ev.data is 'next tick'
        ev.stopPropagation()
        if queue.length > 0
          fn = queue.shift()
          fn()
    window.addEventListener 'message', handler, true
    return (fn) ->
      queue.push fn
      window.postMessage 'next tick', '*'
  else return (f) -> setTimeout(fn, 0)
