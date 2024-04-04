#!/bin/bash
DIR=`date +%m-%d-%y`
DEST=/dumps/rengin/$DIR
PROJECT_DEST=/home/rengin-erp/packages/static/backup/$DIR
mkdir -p $DEST
mkdir -p $PROJECT_DEST
FILE=$DEST/archive.gz
echo $FILE

docker exec -ti mongodb sh -c "mongodump -h localhost:27017 -d rengin -u rengin -p BuildMeUp --authenticationDatabase admin --gzip --archive=/dump/archive.gz"
docker cp mongodb:/dump/archive.gz $DEST/
docker cp mongodb:/dump/archive.gz $PROJECT_DEST/
