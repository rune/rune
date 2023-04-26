const style = document.createElement("style")

// language=CSS
style.innerHTML = `
  @font-face {
    font-family: "Lato";
    font-weight: 400;
    src: url('${require("./Lato-Regular.ttf")}');
  }
  @font-face {
    font-family: "Lato";
    font-weight: 300;
    src: url('${require("./Lato-Light.ttf")}');
  }
  @font-face {
    font-family: "Lato";
    font-weight: 600;
    src: url('${require("./Lato-Bold.ttf")}');
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
    font-family: "Lato", sans-serif;
  }

  * {
    user-select: none;
    box-sizing: border-box;
    line-height: 100%;
  }
`

document.head.appendChild(style)

export {}
