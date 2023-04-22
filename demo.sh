#!/bin/bash 

JWT=$(cat ./example/vc.jwt)
jq -R 'split(".") | .[1] | @base64d | fromjson' <<< "$JWT" > ./example/vc.json

echo "🌴 Validation"
ajv --spec=draft2020 compile -c ./customKeywords.js -s ./example/NewCredentialType.yaml
ajv --spec=draft2020 validate -c ./customKeywords.js -s ./example/NewCredentialType.yaml -d ./example/vc.json 
ajv --spec=draft2020 test -c ./customKeywords.js -s ./example/NewCredentialType.yaml -d ./example/vc.json --valid


curl -s https://transmute-industries.github.io/vc-json-schema/example/NewCredentialType.yaml > schema.yaml
curl -s https://transmute-industries.github.io/vc-json-schema/example/vc.jwt > vc.jwt
JWT=$(cat ./vc.jwt)
jq -R 'split(".") | .[1] | @base64d | fromjson' <<< "$JWT" > ./vc.json
ajv --spec=draft2020 test -c ./customKeywords.js -s ./schema.yaml -d ./vc.json --valid