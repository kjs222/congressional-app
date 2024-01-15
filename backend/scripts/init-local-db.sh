#!/bin/sh

if [ $(command -v docker) ]; then
    docker rm -f congressional-ddb
    docker run --name  congressional-ddb -it -d -p 8000:8000 amazon/dynamodb-local
    sleep 10
else
    echo "docker not installed"
fi
