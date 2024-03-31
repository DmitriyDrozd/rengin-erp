#!/bin/bash
DIR=`date +%d-%m-%y`
DEST=/dumps/rengin/$DIR
mkdir -p $DEST
FILE=$DEST/archive.gz
echo $FILE

docker exec -ti mongodb sh -c "mongodump -h localhost:27017 -d rengin -u rengin -p BuildMeUp --authenticationDatabase admin --gzip --archive=/dump/archive.gz"
docker cp mongodb:/dump/archive.gz $DEST/

rm -rf  /dumps/rengin/last

cp -r $DEST /dumps/rengin/last