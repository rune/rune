echo 'Which release is it gonna be?'

select version in patch minor major
do
  case $version in
  patch|minor|major)
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
