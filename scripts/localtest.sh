#!/bin/bash

#setup
docker run --rm -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=123456 -d postgres
sleep 5s
docker exec -it postgres psql --port 5432 --username postgres --dbname postgres --command 'CREATE FUNCTION notify_trigger() RETURNS trigger AS $$ DECLARE BEGIN PERFORM pg_notify('"'"'watchers'"'"', TG_TABLE_NAME || '"'"',id,'"'"' || NEW.id );  RETURN new; END; $$ LANGUAGE plpgsql;'

npm run start&

sleep 5s
docker exec -it postgres psql --port 5432 --username postgres --dbname postgres --command 'CREATE TRIGGER watched_table_trigger AFTER INSERT ON messages FOR EACH ROW EXECUTE PROCEDURE notify_trigger();'

echo
echo "feathers server started, press enter to stop and cleanup docker containers"
echo

pid="$(ps -a | grep node | awk '{print $1}')"
echo $pid
read -p "" x

kill $pid

sleep 1s

echo "cleaning up..."
docker stop postgres