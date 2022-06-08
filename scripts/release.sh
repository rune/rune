if [ "$(git rev-parse --abbrev-ref HEAD)" != "staging" ]; then
  echo "You are not on staging branch";
  exit -1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes detected";
  exit -1
fi

echo 'Which release is it gonna be?'

select version in patch minor major
do
  case $version in
  patch|minor|major)
    git pull
    yarn version --$version --no-git-tag-version
    node scripts/updateVersions.js
    VERSION=$(node -p -e "require('./package.json').version")
    git add --all
    git commit -m "$VERSION"
    git tag "v$VERSION"
    git push
    git push origin "v$VERSION"
    break
    ;;
  *)
    echo "Invalid input"
    exit -1
    ;;
  esac
done
