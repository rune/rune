echo 'Which release is it gonna be?'

select version in patch minor major
do
  case $version in
  patch|minor|major)
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
