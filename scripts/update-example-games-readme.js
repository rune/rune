const games = [
    {
        name: "Tic Tac Toe",
        image: "docs/static/img/multiplayer-games/tic-tac-toe.png",
        links: ["https://developers.dusk.gg/examples/tic-tac-toe/", "https://github.com/dusk-gg/dusk/tree/staging/examples/tic-tac-toe"],
    },
    {
        name: "Outmatched",
        image: "docs/static/img/multiplayer-games/outmatched.png",
        links: ["https://developers.dusk.gg/examples/outmatched/", "https://github.com/dusk-gg/dusk/tree/staging/examples/outmatched"],
    },
    {
        name: "Sudoku",
        image: "docs/static/img/multiplayer-games/sudoku.png",
        links: ["https://developers.dusk.gg/examples/sudoku/", "https://github.com/dusk-gg/dusk/tree/staging/examples/sudoku"],
    },
    {
        name: "Pinpoint",
        image: "docs/static/img/multiplayer-games/pinpoint.png",
        links: ["https://developers.dusk.gg/examples/pinpoint/", "https://github.com/dusk-gg/dusk/tree/staging/examples/pinpoint"],
    },
    {
        name: "OinkOink",
        image: `docs/static/img/multiplayer-games/oink-oink.png`,
        links: [`https://developers.dusk.gg/examples/oink-oink/`, `https://github.com/dusk-gg/dusk/tree/staging/examples/oink-oink`],
    },
    {
        name: "Paddle",
        image: `docs/static/img/multiplayer-games/paddle.png`,
        links: [`https://developers.dusk.gg/examples/paddle/`, `https://github.com/dusk-gg/dusk/tree/staging/examples/paddle`],
    },
    {
        name: "Cube Rush",
        image: `docs/static/img/multiplayer-games/cube-rush.png`,
        links: [`https://developers.dusk.gg/examples/cube-rush/`, `https://github.com/dusk-gg/dusk/tree/staging/examples/cube-rush`],
    },
    {
        name: "Neon Snake",
        image: `docs/static/img/multiplayer-games/neon-snake.png`,
        links: [`https://developers.dusk.gg/examples/neon-snake/`, `https://github.com/dusk-gg/dusk/tree/staging/examples/neon-snake`],
    },
]

const generateMarkdownTable = () => {
    let markdown = ''

    for (let i = 0; i < games.length; i += 4) {
        let headerRow = '|'
        let dividerRow = '|'
        let imageRow = '|'
        let linkRow = '|'

        for (let j = i; j < i + 4 && j < games.length; j++) {
            const game = games[j];
            headerRow += ` ${game.name} |`
            dividerRow += '---|'
            imageRow += ` [<img src="${game.image}" width=500>](${game.links[0]}) |`
            linkRow += ` [Demo](${game.links[0]}), [Source](${game.links[1]}) |`
        }

        markdown += `${headerRow}\n${dividerRow}\n${imageRow}\n${linkRow}\n\n`
    }

    return markdown.trim()
}

console.log(generateMarkdownTable())
