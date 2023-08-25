import LilitaOne from "./LilitaOne-Regular.ttf"
import UbuntuMonoBold from "./UbuntuMono-Bold.ttf"
import { rel } from "./rel"

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

  @keyframes rocking {
    0% {
      transform: translateX(-5%);
    }
    50% {
      transform: translateX(5%);
    }
    100% {
      transform: translateX(-5%);
    }
  }

  @keyframes rising {
    0% {
      bottom: 0;
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      bottom: ${rel(120)};
      opacity: 0;
    }
  }

  @keyframes shrinking {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0) translateX(-50%);
    }
  }

  @keyframes pulsing {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes buttonScale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

document.head.appendChild(style)

export {}
