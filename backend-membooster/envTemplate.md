# ENVIRONMENT FILE TEMPLATE AND RULES

## File name and location

- File name should be => .env.{environment_name} Example: if the environment is 'dev' then name will be ".env.dev"
- This env file should be locatedat that level where this file is present

## The mandatory variables needed and their types

- **PORT** = number
- **MORGAN_MODE** = string
- **MONGO_DB_URI** = string (URL)
- **MAIL_SETUP** = {"service": string, "host": string, "port": number, "secure": string, "auth": {"user": string (email ID), "pass": string }}

* **ACCESS_TOKEN_PRIVATE_KEY** = string (base64)
* **ACCESS_TOKEN_PUBLIC_KEY** = string (base64)
* **REFRESH_TOKEN_PRIVATE_KEY** = string (base64)
* **REFRESH_TOKEN_PUBLIC_KEY** = string (base64)
