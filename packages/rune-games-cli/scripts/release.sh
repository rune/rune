if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "You are not on master branch";
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
    yarn version --$version
    git push
    git push --tags
    break
    ;;
  *)
    echo "Invalid input"
    exit -1
    ;;
  esac
done
