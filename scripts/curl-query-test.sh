#!/bin/bash

url="http://localhost"
port="3030"
endpoint="messages"


jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJybGUiOiJhZG1pbixib3NzLHRoZW1hbiIsImlhdCI6MTUyOTkwMDAyNCwiZXhwIjoxNTI5OTg2NDI0LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0IiwiaXNzIjoiZmVhdGhlcnMiLCJzdWIiOiI0MDhiN2UwMy04MjA0LTQyOWUtOWZiMC0zMmIxNjM3YzgyN2EiLCJqdGkiOiI5YTJmZGM2OS02YmU0LTRjYTItOWRkYi0yM2FmNWE2NDhmN2IifQ.6VnNg9Io3pqaXq0E3zza5tOLaDIhHGcr13OqkIA0QDA"


curl "$url:$port/$endpoint" -H 'Content-Type: application/json' -H "Authorization: $jwt"
