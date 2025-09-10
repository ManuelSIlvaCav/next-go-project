# ToDo

- Make a production build connected to a server


# Zitadel
- Frontend logins to zitadel instance server
- Receives the token and sends it over to the backend on authenticated requests
- Go backend, validates the roles for this user
- Go backend should have a service-user (machine-machine) credentials to call the introspection API from zitadel
    - Validate the received token with zitadel roles and permisions

Test
Client = 337111695333875972
Secret = mNpgVyxWTCDNqkNSS3JCzWs28otoVfALdZho55MmjgIalpfnGe4GgqhaqttKYzT8