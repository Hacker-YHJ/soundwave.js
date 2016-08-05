class Util
  # map [-1, 1] -> [0, height]
  @createProjectToCanvas: (height) ->
    (input) -> height * .5 * (1 + input)

module.exports = Util
