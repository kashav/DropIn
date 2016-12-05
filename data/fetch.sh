#!/usr/bin/env bash

curl 'https://raw.githubusercontent.com/cobalt-uoft/datasets/master/buildings.json' | jq --slurp -c '[ .[] | select(.campus == "UTSG") | {id, code, name, address, lat, lng} ]' > buildings.json
curl 'https://raw.githubusercontent.com/cobalt-uoft/datasets/master/courses.json' | jq --slurp -c '[ .[] | select(.campus == "UTSG" and .term == "2017 Winter") | {id, code, name, description, meeting_sections} ]' > courses.json
python3 parse.py > data.json
cp data.json ../docs
