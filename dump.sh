#!/bin/bash
DIR=`date +%d-%m-%y`
DEST=/dumps/rengin/$DIR
mkdir -p $DEST
FILE=$DEST/archive.gz
echo $FILE
mongodump -h localhost:27017 -d rengin -u root -p BuildMeUp --authenticationDatabase admin --archive=$FILE
rm -rf  /dumps/rengin/last

cp -r $DEST /dumps/rengin/last
