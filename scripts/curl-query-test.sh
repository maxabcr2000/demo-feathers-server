#!/bin/bash

url="http://localhost"
port="3030"
endpoint="messages/408b7e03-8204-429e-9fb0-32b1637c827a"


jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJybGUiOiJhZG1pbixib3NzLHRoZW1hbiIsImlhdCI6MTUzMDA3MDQ2MSwiZXhwIjoxNTMwMTU2ODYxLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiZmVhdGhlcnMiLCJzdWIiOiI0MDhiN2UwMy04MjA0LTQyOWUtOWZiMC0zMmIxNjM3YzgyN2EiLCJqdGkiOiI0ZGJiMmI4NS1hNTg1LTRlYmMtYmQ5Zi03YjdmZDk5OTU2ZjAifQ.R06FIgewyi8Dn44jHhWw6pGpfozq0xKIffHeRN8ooRM"


curl "$url:$port/$endpoint" -H 'Content-Type: application/json' -H "Authorization: $jwt"

#INSERT INTO messages (content, sender,receiver) VALUES('Hello from myself', '408b7e03-8204-429e-9fb0-32b1637c827a', '408b7e03-8204-429e-9fb0-32b1637c827a');
#UPDATE messages SET content='Updated contect' WHERE id = 1;
#DELETE FROM messages where id = 1;