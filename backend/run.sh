#!/bin/sh
echo "-> starting prisma migrations to mysql...\n"
sleep 40
npm run migrate:deploy
sleep 3
npm run start