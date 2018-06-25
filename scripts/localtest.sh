#!/bin/bash

#setup
docker run --rm -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=123456 -d postgres
sleep 5s
docker cp ./pginit.sql postgres:/pginit.sql
docker exec postgres psql -U postgres -f /pginit.sql > /dev/null

npm run start&

pid=$!

echo
echo "feathers server started, press enter to stop and cleanup docker containers"
echo


echo $pid
read -p "" x

kill $pid

sleep 1s

echo "cleaning up..."
docker stop postgres