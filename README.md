# walletapp backend api server

# Endpoint Examples:

Check Balance:

  curl -X POST -k http://127.0.0.1:15000/api/v1/wallet/balance \
    -H 'Content-Type: application/json' \
    --data '{"user_id":1001}'

Transaction History:

  curl -X POST -k http://127.0.0.1:15000/api/v1/wallet/txn \
    -H 'Content-Type: application/json' \
    --data '{"user_id":1001}'

Deposit:

  curl -X POST -k http://127.0.0.1:15000/api/v1/wallet/deposit \
    -H 'Content-Type: application/json' \
    --data '{"user_id":1001, "amount":10, "currency": "hkd"}'

Withdraw:

  curl -X POST -k http://127.0.0.1:15000/api/v1/wallet/withdraw \
    -H 'Content-Type: application/json' \
    --data '{"user_id":1001, "amount":10, "currency": "hkd"}'

Transfer:

  curl -X POST -k http://127.0.0.1:15000/api/v1/wallet/transfer \
    -H 'Content-Type: application/json' \
    --data '{"user_id":1001, "amount":10, "currency": "hkd", "touser_id": 1002}'

Convert:

  curl -X POST -k http://127.0.0.1:15000/api/v1/wallet/convert \
    -H 'Content-Type: application/json' \
    --data '{"user_id":1001, "amount":10, "base_currency": "usd", "quote_currency": "hkd"}'

