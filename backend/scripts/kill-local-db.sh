#!/bin/sh

if [ $(command -v docker) ]; then
    docker rm -f congressional-ddb
    if [ $? -eq 0 ]; then
    	echo "killed local db"
	fi
else
    echo "docker not installed, giving up killing local db"
fi