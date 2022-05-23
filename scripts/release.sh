echo 'Which release is it gonna be?'

select version in patch minor major
do
  case $version in
  patch|minor|major)
    yarn version --$version --no-git-tag-version
    node scripts/updateVersions.js
    git add --all
    git commit -m "$npm_package_version"
    git push
    git tag "v$npm_package_version"
    git push origin "v$npm_package_version"
    break
    ;;
  *)
    echo "Invalid input"
    exit -1
    ;;
  esac
done
