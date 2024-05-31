const regexes = {
  minPlayers: /minPlayers\s*:\s*?([0-9]+)/,
  maxPlayers: /maxPlayers\s*:\s*?([0-9]+)/,
  playerJoined: /playerJoined\s*[:(]/,
  playerLeft: /playerLeft\s*[:(]/,
  updatesPerSecondDefined: /updatesPerSecond\s*:/,
  updatesPerSecond: /updatesPerSecond\s*:\s*?([0-9]+)/,
  inputDelay: /inputDelay\s*:\s*?([0-9]+)/,
  landscape: /landscape\s*:\s*?(true|false)/,
  persistPlayerData: /persistPlayerData\s*:\s*?(true|false)/,
}

export function extractMultiplayerMetadata(logicJsContent: string) {
  const minPlayersString = logicJsContent.match(regexes.minPlayers)?.at(1)
  const minPlayers = minPlayersString ? parseInt(minPlayersString) : undefined

  const maxPlayersString = logicJsContent.match(regexes.maxPlayers)?.at(1)
  const maxPlayers = maxPlayersString ? parseInt(maxPlayersString) : undefined

  const landscapeString = logicJsContent.match(regexes.landscape)?.at(1)
  const landscape = landscapeString ? landscapeString === "true" : undefined

  const persistPlayerDataString = logicJsContent
    .match(regexes.persistPlayerData)
    ?.at(1)
  const persistPlayerData = persistPlayerDataString
    ? persistPlayerDataString === "true"
    : undefined

  const updatesPerSecondDefined =
    logicJsContent.match(regexes.updatesPerSecondDefined) !== null
  const updatesPerSecondString = logicJsContent
    .match(regexes.updatesPerSecond)
    ?.at(1)
  const updatesPerSecond = updatesPerSecondString
    ? parseInt(updatesPerSecondString)
    : undefined

  const handlesPlayerJoined = regexes.playerJoined.test(logicJsContent)

  const handlesPlayerLeft = regexes.playerLeft.test(logicJsContent)

  const inputDelayString = logicJsContent.match(regexes.inputDelay)?.at(1)
  const inputDelay = inputDelayString ? parseInt(inputDelayString) : undefined

  return {
    minPlayers,
    maxPlayers,
    handlesPlayerJoined,
    handlesPlayerLeft,
    updatesPerSecond,
    updatesPerSecondDefined,
    inputDelay,
    landscape,
    persistPlayerData,
  }
}
