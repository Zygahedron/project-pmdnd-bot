#!/bin/bash
pkill -f pmdndbot
git pull origin master
nohup node index.js pmdndbot &> bot.log &