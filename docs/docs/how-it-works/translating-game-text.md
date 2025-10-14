---
sidebar_position: 2
---

# Translating In-Game Text

Rune is popular around the world and many players may not read the language your game text is written in. Because of this it is best to keep text in games to a minimum and try and rely on visual elements to convey instructions, ranking, etc. When text is necessary, Rune does provide
a way to render it translated into the player's language using `Rune.t()`.

## Identifying Text to Translate

To do this, in your client code (not html or logic.js files), you can use the `Rune.t()` function
to identify the strings that you would like to display in the player's chosen language.

```js
innerMessageElement.textContent = Rune.t("Extra Move!")
```

These translations are statically extracted so passing variables to `Rune.t()` will not work.

**Incorrect**

```js
const youWon = "You Won"
innerMessageElement.textContent = Rune.t(youWon)
```

**Correct**

```js
const youWon = Rune.t("You Won")
innerMessageElement.textContent = youWon
```

### Using Interpolated Values

It is possible to render translated text with some dynamic (untranslated values). This is done by adding placeholders to the translation string for each value and then passing the values as a second argument to `Rune.t()`.

```js
Rune.t("You gained {{ score }} points", {
  score: numericScore.toLocaleString(),
})
```

## Extracting Text to Translate

Once you have added `Rune.t()` calls to your game, you can run the Rune cli extraction function to generate the translation files that will map these strings to their actual translated values

```bash
npx rune@latest extract-translations
```

This will find any `Rune.t()` calls in your source code and generate json files with all the keys in a `public/translations` folder, such as `en.json` for English, `es.json` for Spanish and so on. These files will need to be bundled with your game so the Rune client can fetch the correct language file at runtime. It expects these files to exist in a `/translations/` directory relative to the index.html file that renders the game. If you would like to generate the files in a different location in your repo because your packaging method does not use a `/public` folder, you can specify the path to write the translations as an argument to the above command.

## Filling in the translations.

Currently most Rune user read one of these 4 languages:

- English
- Portuguese
- Russian
- Spanish

So the extract-translations command will create one json file where the keys are the strings passed to `Rune.t()` and the values are empty strings. You can fill in these translations manually, using some translation software or service, or passing the json files to an LLM for it to create the translations. Once these translations are filled in, running `npx rune@latest extract-translations` again will not overwrite them, only add new string keys that are not already in the json files or remove any keys that are no longer referenced in your game.

For example, the extraction command might generate a file like this named `es.json` for Spanish translations:

```json
{
  "(You)": "",
  "tap to play": ""
}
```

You would modify it with the translated strings so it would look like this:

```json
{
  "(You)": "(Tú)",
  "tap to play": "toca para jugar"
}
```

Once these translations are added, you can run your game using the Rune SDK Dev UI and you should be able to switch languages using the language drop-down and see your translated strings in action.

## Important Considerations

- Currently only English, Portuguese, Russian and Spanish language translations are supported by Rune.
- Translations always happen after the Rune client has been initialized so you should only create or render translated strings in response to invocations of the onChange() handler you provide to `Rune.initClient()`. Invoking `Rune.t()` prior to the client initialization will not render translated text.
