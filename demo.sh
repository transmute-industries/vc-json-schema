#!/bin/bash 

JWT=$(cat ./example/vc.jwt)
jq -R 'split(".") | .[1] | @base64d | fromjson' <<< "$JWT" > ./example/vc.json

echo "🌴 Validation"
ajv --spec=draft2020 compile -c ./customKeywords.js -s ./example/NewCredentialType.yml
ajv --spec=draft2020 validate -c ./customKeywords.js -s ./example/NewCredentialType.yml -d ./example/vc.json 
ajv --spec=draft2020 test -c ./customKeywords.js -s ./example/NewCredentialType.yml -d ./example/vc.json --valid
