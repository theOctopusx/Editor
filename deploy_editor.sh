#!/bin/bash

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/editor

cd ~/Editor
git pull

pnpm install
pnpm build

pm2 reload editor

echo "Deployed Successfully"
echo "Link: https://editor.monsterstudio.co"
