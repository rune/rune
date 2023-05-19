import LatoRegular from "./Lato-Regular.ttf"
import LatoLight from "./Lato-Light.ttf"
import LatoBold from "./Lato-Bold.ttf"

const style = document.createElement("style")

// language=CSS
style.innerHTML = `
  @font-face {
    font-family: "Lato";
    font-weight: 400;
    src: url('${LatoRegular}');
  }

  @font-face {
    font-family: "Lato";
    font-weight: 300;
    src: url('${LatoLight}');
  }

  @font-face {
    font-family: "Lato";
    font-weight: 600;
    src: url('${LatoBold}');
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
  
  @keyframes onboardingCellReveal {
    0% {
      opacity: 0;
    }
    40%{
      opacity: 0;
    }
    60%{
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
`

document.head.appendChild(style)

export {}
