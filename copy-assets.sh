set -e

ASSETS_DIR="$TMPDIR/game-asset-import"
WORK_DIR="$PWD"
GAME=$1

if [ -z "$GAME" ]
then
  echo "No game provided"
  exit 1
fi

mkdir -p "$ASSETS_DIR"
cd "$ASSETS_DIR" || exit

if [ ! -e "$ASSETS_DIR/game-assets" ]
then
  git clone git@github.com:rune/game-assets.git
else
    cd game-assets || exit 1
    git checkout -f staging
    git pull
fi

cd "$WORK_DIR" || exit
cp -r "$ASSETS_DIR/game-assets/$GAME/." .
