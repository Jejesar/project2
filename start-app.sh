#!/bin/bash

# change to the desired directory
cd /home/group5/Desktop/project2/

# start docker compose
docker compose start

# wait until the docker containers have started
while ! docker ps | grep -q "project2"; do
  sleep 1
done

sleep 20
# start the node app
cd /home/group5/Desktop/project2/app/bin/
node www
