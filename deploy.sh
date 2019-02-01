!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

git add .

git commit -m $1

git push

# 更新包:https://www.kancloud.cn/shellway/npm-doc/199994
# npm version patch
# 补丁版本（patch）、次版本（minor）或主版本（major）
# npm publish