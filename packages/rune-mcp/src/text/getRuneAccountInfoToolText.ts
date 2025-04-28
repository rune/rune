export const getRuneAccountInfoToolDescription = `Retrieves information about the logged-in Rune developer account.

AGENT INSTRUCTIONS:
Use when user wants to:
- Check login status with Rune platform
- View their account information
- See their uploaded games`

export const getRuneAccountInfoResponseNotLoggedIn = `You are not logged in to Rune.
Use the login-to-rune tool to authenticate.`

export const getRuneAccountInfoResponseLoggedIn = (
  email: string,
  games: Array<{ id: number; title: string; status: string }>
) => {
  const gamesText =
    games.length > 0
      ? games
          .map(
            (game) => `- ${game.title} (ID: ${game.id}, Status: ${game.status})`
          )
          .join("\n")
      : "No games found"

  return `Rune Account: ${email}

Your games:
${gamesText}

To upload a new game, use the upload-new-rune-game tool.
To update an existing game, use the upload-existing-rune-game tool.`
}
