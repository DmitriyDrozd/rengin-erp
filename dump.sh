#!/bin/bash
DIR=`date +%m-%d-%y`
DEST=/dumps/rengin/$DIR
PROJECT_DEST=/home/rengin-erp/packages/static/backup/$DIR
mkdir -p $DEST
mkdir -p $PROJECT_DEST
FILE=$DEST/archive.gz
echo $FILE

COMMAND="mongodump mongodb://rengin:BuildMeUp@rengindesk.ru:27017/rengin?authSource=admin --gzip --archive=/dump/$DIR/archive.gz"

docker exec mongodb sh -c $COMMAND
docker cp mongodb:/dump/$DIR/archive.gz $DEST/
docker cp mongodb:/dump/$DIR/archive.gz $PROJECT_DEST/
