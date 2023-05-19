const regexes = {
  minPlayers: /minPlayers\s*:\s*?([0-9]+)/,
  maxPlayers: /maxPlayers\s*:\s*?([0-9]+)/,
  playerJoined: /playerJoined\s*[:(]/,
  playerLeft: /playerLeft\s*[:(]/,
}

export function extractMultiplayerMetadata(logicJsContent: string) {
  const minPlayersString = logicJsContent.match(regexes.minPlayers)?.at(1)
  const minPlayers = minPlayersString ? parseInt(minPlayersString) : undefined

  const maxPlayersString = logicJsContent.match(regexes.maxPlayers)?.at(1)
  const maxPlayers = maxPlayersString ? parseInt(maxPlayersString) : undefined

  const handlesPlayerJoined = regexes.playerJoined.test(logicJsContent)

  const handlesPlayerLeft = regexes.playerLeft.test(logicJsContent)

  return {
    minPlayers,
    maxPlayers,
    handlesPlayerJoined,
    handlesPlayerLeft,
  }
}
