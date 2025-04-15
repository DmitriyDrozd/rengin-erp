#!/bin/bash
DIR=`date +%m-%d-%y`
DEST=/dumps/rengin/$DIR
PROJECT_DEST=/root/rengin-static/backup/$DIR
mkdir -p $DEST
mkdir -p $PROJECT_DEST
FILE=$DEST/archive.gz
echo $FILE

docker exec mongodb sh -c "mkdir dump"
docker exec mongodb sh -c "cd /dump & mkdir /dump/$DIR"
docker exec mongodb sh -c "mongodump mongodb://rengin:BuildMeUp@rengindesk.ru:27017/rengin?authSource=admin --gzip --archive=/dump/$DIR/archive.gz"
docker cp mongodb:/dump/$DIR/archive.gz $DEST/
docker cp mongodb:/dump/$DIR/archive.gz $PROJECT_DEST/
