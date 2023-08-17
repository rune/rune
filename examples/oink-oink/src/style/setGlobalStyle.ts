import LilitaOne from "./LilitaOne-Regular.ttf"

const style = document.createElement("style")

// language=CSS
style.innerHTML = `
  @font-face {
    font-family: "LilitaOne";
    src: url('${LilitaOne}');
  }

  html,
  body,
  #root {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  body {
    font-family: "LilitaOne", sans-serif;
  }

  * {
    user-select: none;
    box-sizing: border-box;
    line-height: 114%;
    letter-spacing: -0.02em; 
  }
`

document.head.appendChild(style)

export {}
