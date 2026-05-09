curl --request POST \
  --url https://n8n.hamzasallam.online/webhook/horizonvista/api/send-message \
  --header 'Authorization: Basic YWNjZXNzX3Rva2VuOmNtcGU0MTJob3Jpem9uVmlzdGE=' \
  --header 'content-type: application/json' \
  --data '{"message":"hi","sessionId":"string"}'