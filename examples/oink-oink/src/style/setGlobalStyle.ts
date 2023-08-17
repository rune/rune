import LilitaOne from "./LilitaOne-Regular.ttf"
import UbuntuMonoBold from "./UbuntuMono-Bold.ttf"

const style = document.createElement("style")

// language=CSS
style.innerHTML = `
  @font-face {
    font-family: LilitaOne;
    src: url('${LilitaOne}');
  }
  
  @font-face {
    font-family: UbuntuMono;
    font-weight: 700;
    src: url('${UbuntuMonoBold}');
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
    color: white;
  }

  * {
    user-select: none;
    box-sizing: border-box;
    line-height: 114%;
  }
`

document.head.appendChild(style)

export {}
