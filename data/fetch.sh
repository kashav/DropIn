#!/usr/bin/env bash

curl 'https://raw.githubusercontent.com/cobalt-uoft/datasets/master/buildings.json' | jq --slurp 'map(select(.campus == "UTSG")) | map({id, code, name, address, lat, lng}) | .[] | {(.id): .}' | jq --slurp add -c > buildings.json
curl 'https://raw.githubusercontent.com/cobalt-uoft/datasets/master/courses.json' | jq --slurp -c 'map(select(.campus == "UTSG" and .term == "2017 Winter")) | map({id, code, name, description, meeting_sections})' > courses.json
python3 parse.py > data.json
cp data.json ../docs
