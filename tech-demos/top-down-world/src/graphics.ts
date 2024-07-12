const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
export const graphicsCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log("Canvas size: " + canvas.width + "x"+canvas.height);

export type TileSet = {
    image: HTMLImageElement;
    tilesAcross: number;
    tileWidth: number;
    tileHeight: number;
}

export function loadTileSet(src: string, tileWidth: number, tileHeight: number): Promise<TileSet> {
    return new Promise<TileSet>((resolve, reject) => {
        const image = new Image();
        image.src = src;
    
        image.addEventListener("load", () => {
            console.log("Loaded: " + src);
            resolve({
                image,
                tilesAcross: Math.floor(image.width / tileWidth),
                tileWidth, 
                tileHeight
            });
        });
        image.addEventListener("error", () => {
            reject("Failed to load: " + src);
        });
    });
}

export function drawTile(x: number, y: number, tileSet: TileSet, tile: number, flipped: boolean = false): void {
    const tx = (tile % tileSet.tilesAcross) * tileSet.tileWidth;
    const ty = Math.floor(tile / tileSet.tilesAcross) * tileSet.tileHeight;

    graphicsCtx.save();
    graphicsCtx.translate(x, y);
    if (flipped) {
        graphicsCtx.translate(tileSet.tileWidth, 0);
        graphicsCtx.scale(-1,1);
    }
    graphicsCtx.drawImage(tileSet.image, tx, ty, tileSet.tileWidth, tileSet.tileHeight, 0, 0, tileSet.tileWidth, tileSet.tileHeight);
    graphicsCtx.restore();
}
