#!/bin/bash
DIR=`date +%d-%m-%y`
DEST=/dumps/rengin/$DIR
mkdir -p $DEST
FILE=$DEST/archive.gz
echo $FILE

docker exec -ti mongodb sh
mongodump -h localhost:27017 -d rengin -u rengin -p BuildMeUp --authenticationDatabase admin --gzip --archive=$FILE
exit
docker cp mongodb:$FILE /dumps/rengin/

rm -rf  /dumps/rengin/last

cp -r $DEST /dumps/rengin/last
