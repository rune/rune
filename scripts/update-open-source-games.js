// Want to add your game?
// 1. Add it to the array below
// 2. Run `node scripts/update-open-source-games.js`
// 3. Submit a PR with changes to this file and `games.md`

const games = [
    {
        name: "Dungeons of Glee",
        rune: true,
        links: ["https://app.dusk.gg/dev-rRTWDp5D", "https://github.com/kevglass/dungeonsofglee"],
        description: "Crawl a dungeon with friends!"
    },
    {
        name: "FruitScape",
        rune: true,
        links: ["https://app.dusk.gg/dev-R612gCec", "https://github.com/jallen-dev/fruitscape"],
        description: "They've got fruit you need. Trade to gather the ingredients!"
    },
    {
        name: "Spooky Cookie",
        rune: true,
        links: ["https://app.dusk.gg/dev-5guffVqx", "https://github.com/wialy/react-game-jam-spooky-cookie"],
        description: "Pac-Man mixed with Bomberman. Outplay your rivals in this race to the treats!"
    },
    {
        name: "Goblin Chess",
        rune: true,
        links: ["https://app.dusk.gg/dev-OVhXwPb9", "https://github.com/kickassCoderz/goblin-chess"],
        description: "The ancient game but with a few twists. Destroy your opponent's king to win."
    },
    {
        name: "Tic Tac Toe",
        rune: true,
        links: ["https://developers.dusk.gg/examples/tic-tac-toe/", "https://github.com/dusk-gg/dusk/tree/staging/examples/tic-tac-toe"],
        description: "The classic three-in-a-row game."
    },
    {
        name: "Paddle",
        rune: true,
        links: ["https://developers.dusk.gg/examples/paddle/",
            "https://github.com/dusk-gg/dusk/tree/staging/examples/paddle"],
        description: "Serve, rally, score!"
    },
    {
        name: "Sudoku",
        rune: true,
        links: ["https://developers.dusk.gg/examples/sudoku/", "https://github.com/dusk-gg/dusk/tree/staging/examples/sudoku"],
        description: "Collaborative version of the classic Sudoku game."
    },
    {
        name: "Neon Snake",
        rune: true,
        links: ["https://developers.dusk.gg/examples/neon-snake/", "https://github.com/dusk-gg/dusk/tree/staging/examples/neon-snake"],
        description: "A new take on the Zatacka snake game. Plot your path and outlast them all!"
    },
    {
        name: "Cube Rush",
        rune: true,
        links: ["https://developers.dusk.gg/examples/cube-rush/", "https://github.com/dusk-gg/dusk/tree/staging/examples/cube-rush"],
        description: "Who will race to the finish line first?"
    },
    {
        name: "Outmatched",
        rune: true,
        links: ["https://developers.dusk.gg/examples/outmatched/", "https://github.com/dusk-gg/dusk/tree/staging/examples/outmatched"],
        description: "Multiplayer Match-3 game with combos and special moves!"
    },
    {
        name: "Pinpoint",
        rune: true,
        links: ["https://developers.dusk.gg/examples/pinpoint/", "https://github.com/dusk-gg/dusk/tree/staging/examples/pinpoint"],
        description: "Look around beautiful 360 degree panoramas and guess where you are!"
    },
    {
        name: "OinkOink",
        rune: true,
        links: ["https://developers.dusk.gg/examples/oink-oink/", "https://github.com/dusk-gg/dusk/tree/staging/examples/oink-oink"],
        description: "Think you know what a sad frog sounds like? Test your impressions!"
    },
    // Beginning of Non-Rune Games
    {
        name: "Curvytron",
        rune: false,
        links: ["http://www.curvytron.com/", "https://github.com/Curvytron/curvytron"],
        description: "A multiplayer tron-like game... with curves!"
    },
    {
        name: "ArmorAlley",
        rune: false,
        links: ["https://armor-alley.net", "https://github.com/scottschiller/ArmorAlley"],
        description: "Interpretation of Armor Alley, a combat strategy game released in 1990."
    },
    {
        name: "F.LF",
        rune: false,
        links: ["https://project-f.github.io", "https://github.com/Project-F/F.LF"],
        description: "Open-source implementation of Little Fighter 2."
    },
    {
        name: "13",
        rune: false,
        links: ["https://iioi.herokuapp.com/", "https://github.com/eliasku/13"],
        description: "Fast-action multiplayer game made for js13k-2022."
    },
    {
        name: "TOSIOS",
        rune: false,
        links: ["https://tosios.online/", "https://github.com/halftheopposite/TOSIOS"],
        description: "Abbreviation stands for 'The Open-Source IO Shooter'."
    },
    {
        name: "Scrabble",
        rune: false,
        links: ["https://scrabble.bencuan.me/#/", "https://github.com/64bitpandas/SimultaneousScrabble"],
        description: "Multiplayer party scrabble for 2-10 players."
    },
    {
        name: "Edelweiss",
        rune: false,
        links: ["https://makc.github.io/Edelweiss/", "https://github.com/makc/Edelweiss"],
        description: "Multiplayer fork of the Edelweiss platformer game."
    },
    {
        name: "Monster Valle",
        rune: false,
        links: ["https://monstervalle.onrender.com", "https://github.com/ivopc/Monster-Valle/"],
        description: "Full-featured MMORPG based in Pokémon."
    },
    {
        name: "Swordbattle.io",
        rune: false,
        links: ["https://swordbattle.io/", "https://github.com/codergautam/swordbattle.io"],
        description: "A multiplayer sword fighting IO game."
    },
    {
        name: "GeoGuess",
        rune: false,
        links: ["https://geoguess.games", "https://github.com/GeoGuess/GeoGuess"],
        description: "Open-source geography game with Google Map StreetView."
    }
]

const generateTableHTML = () => {
    let tableHTML = `<table>
  <tr>
    <th>Game</th>
    <th>Rune</th>
    <th>Links</th>
    <th>Description</th>
  </tr>`

    for (const game of games) {
        if (!game.name || game.rune === undefined || game.links.length !== 2 || !game.description || game.description.length > 80) {
            throw new Error("Invalid input for game: " + JSON.stringify(game))
        }
        tableHTML += `
  <tr>
    <td style="vertical-align: middle;">${game.name}</td>
    <td style="text-align: center; vertical-align: middle;">${game.rune ? '✅' : ''}</td>
    <td style="vertical-align: middle;"><a href="${game.links[0]}">Demo</a>, <a href="${game.links[1]}">Source</a></td>
    <td style="vertical-align: middle;">${game.description}</td>
  </tr>`
    }

    tableHTML += `\n</table>`
    return tableHTML
}

console.log(generateTableHTML())
