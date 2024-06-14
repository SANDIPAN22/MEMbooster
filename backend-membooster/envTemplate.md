# ENVIRONMENT FILE TEMPLATE AND RULES

## File name and location

- File name should be => .env
- This env file should be located at that level where this file is present
- Mandatorily gitignored it before pushing into remote repository.

## The mandatory variables needed and their types

- **PORT** = number
- **MORGAN_MODE** = string
- **MONGO_DB_URI** = string (URL)
- **MAIL_SETUP** = {"service": string, "host": string, "port": number, "secure": string, "auth": {"user": string (email ID), "pass": string }}

* **ACCESS_TOKEN_PRIVATE_KEY** = string (base64)
* **ACCESS_TOKEN_PUBLIC_KEY** = string (base64)
* **REFRESH_TOKEN_PRIVATE_KEY** = string (base64)
* **REFRESH_TOKEN_PUBLIC_KEY** = string (base64)
* **ALLOWED_ORIGINS** = Array of allowed frontend origins
