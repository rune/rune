const style = document.createElement("style")

// language=CSS
style.innerHTML = `
  @font-face {
    font-family: "Lexend";
    src: url('${require("./Lexend.ttf")}');
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
    line-height: 130%;
    font-family: "Lexend", sans-serif;
  }

  * {
    user-select: none;
    box-sizing: border-box;
  }
`

document.head.appendChild(style)

export {}
