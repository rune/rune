// A very very simple rendering system that we'll use to demonstrate
// the tech demo without bringing in any other framework. We're just
// going to use plain HTML Canvas rendering to put the images on the
// screen. In a real game you can of course use whichever
// rendering system suits you.
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement
export const graphicsCtx = canvas.getContext("2d") as CanvasRenderingContext2D

canvas.width = window.innerWidth
canvas.height = window.innerHeight
graphicsCtx.imageSmoothingEnabled = false
// A tile set is an image that can be cut into pieces to be displayed
// on the screen efficiently. We number each tile from the top left
// sequentially so the client can render them
export type TileSet = {
  image: HTMLImageElement
  tilesAcross: number
  tileWidth: number
  tileHeight: number
}

// load a tile set and define how the image should be cut up.
export function loadTileSet(
  src: string,
  tileWidth: number,
  tileHeight: number
): Promise<TileSet> {
  return new Promise<TileSet>((resolve, reject) => {
    const image = new Image()
    image.src = src

    image.addEventListener("load", () => {
      console.log("Loaded: " + src)
      resolve({
        image,
        tilesAcross: Math.floor(image.width / tileWidth),
        tileWidth,
        tileHeight,
      })
    })
    image.addEventListener("error", () => {
      reject("Failed to load: " + src)
    })
  })
}

// Draw a single tile to the screen/canvas based on the tile index given. The
// tile can also be flipped to let us do character facing left and right from
// a single image
export function drawTile(
  x: number,
  y: number,
  tileSet: TileSet,
  tile: number,
  flipped = false
): void {
  const tx = (tile % tileSet.tilesAcross) * tileSet.tileWidth
  const ty = Math.floor(tile / tileSet.tilesAcross) * tileSet.tileHeight

  graphicsCtx.save()
  graphicsCtx.translate(x, y)
  if (flipped) {
    graphicsCtx.translate(tileSet.tileWidth, 0)
    graphicsCtx.scale(-1, 1)
  }
  graphicsCtx.drawImage(
    tileSet.image,
    tx,
    ty,
    tileSet.tileWidth,
    tileSet.tileHeight,
    0,
    0,
    tileSet.tileWidth,
    tileSet.tileHeight
  )
  graphicsCtx.restore()
}
