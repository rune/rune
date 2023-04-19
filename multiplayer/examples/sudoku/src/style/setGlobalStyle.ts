const style = document.createElement("style")

// language=CSS
style.innerHTML = `
  @font-face {
    font-family: "Montserrat";
    src: url('${require("./Montserrat.ttf")}');
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
    font-family: "Montserrat", sans-serif;
  }

  * {
    user-select: none;
    box-sizing: border-box;
  }
`

document.head.appendChild(style)

export {}
