export type Controls = {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export const gameInputs: Controls = {
    left: false,
    right: false,
    up: false,
    down: false
}

const touchDevice = ('ontouchstart' in document.documentElement);
const controls = document.getElementById("controls") as HTMLImageElement;
let mousePressed = false;

function mouseDown(x: number, y: number) {
    const rect = controls.getBoundingClientRect();
    const tx = -1 + Math.floor((x - rect.left) / (rect.width / 3));
    const ty = -1 + Math.floor((y - rect.top) / (rect.height / 3));
    
    gameInputs.left = tx == -1;
    gameInputs.right = tx == 1;
    gameInputs.up = ty == -1;
    gameInputs.down = ty == 1;
}

function mouseUp() {
    gameInputs.left = false;
    gameInputs.right = false;
    gameInputs.up = false;
    gameInputs.down = false;
}

if (touchDevice) {
    controls.addEventListener("touchstart", (e: TouchEvent) => {
        mouseDown(e.touches[0].clientX, e.touches[1].clientY);
    })
    controls.addEventListener("touchmove", (e: TouchEvent) => {
        mouseDown(e.touches[0].clientX, e.touches[1].clientY);
    })
    window.addEventListener("touchend", (e: TouchEvent) => {
        mouseUp();
    })
} else {
    controls.addEventListener("mousedown", (e: MouseEvent) => {
        mouseDown(e.clientX, e.clientY);
        mousePressed = true;
    })
    controls.addEventListener("mousemove", (e: MouseEvent) => {
        if (mousePressed) {
            mouseDown(e.clientX, e.clientY);
        }
    })
    window.addEventListener("mouseup", (e: MouseEvent) => {
        mouseUp();
        mousePressed = false;
    })

    // add some keyboard controls to be able to test
    // it in the DevUI easily
    window.addEventListener("keydown", (e: KeyboardEvent) => {
        gameInputs.left = e.key === "ArrowLeft" || e.key === "a" ? true : gameInputs.left;
        gameInputs.right = e.key === "ArrowRight" || e.key == "d" ? true : gameInputs.right;
        gameInputs.up = e.key === "ArrowUp" || e.key === "w" ? true : gameInputs.up;
        gameInputs.down = e.key === "ArrowDown" || e.key =="s" ? true : gameInputs.down;
    })

    window.addEventListener("keyup", (e: KeyboardEvent) => {
        gameInputs.left = e.key === "ArrowLeft" || e.key === "a" ? false : gameInputs.left;
        gameInputs.right = e.key === "ArrowRight" || e.key == "d" ? false : gameInputs.right;
        gameInputs.up = e.key === "ArrowUp" || e.key === "w" ? false : gameInputs.up;
        gameInputs.down = e.key === "ArrowDown" || e.key =="s" ? false : gameInputs.down;
    })
}