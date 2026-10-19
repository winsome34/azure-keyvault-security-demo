const express = require('express');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const app = express();
const port = process.env.PORT || 8080;

const vaultUrl = 'https://keydemotest.vault.azure.net/';
const secretName = 'demo-app-secret';

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(vaultUrl, credential);

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Azure Key Vault Security Demo</title>
        </head>
        <body>
            <h1>Azure Key Vault Security Demo</h1>
            <p>Application: Azure App Service</p>
            <p>Authentication: Managed Identity</p>
            <p>Secret storage: Azure Key Vault</p>
            <p><a href="/test-secret">Test secure secret retrieval</a></p>
        </body>
        </html>
    `);
});

app.get('/test-secret', async (req, res) => {
    try {
        const secret = await secretClient.getSecret(secretName);

        console.log(`Successfully retrieved secret: ${secret.name}`);

        res.status(200).send(`
            <h1>Key Vault Access Successful</h1>
            <p>Secret name: ${secret.name}</p>
            <p>Authentication: Managed Identity</p>
            <p>Secret value: [REDACTED]</p>
        `);
    } catch (error) {
        console.error('Key Vault retrieval failed:', error.message);

        res.status(500).send(`
            <h1>Key Vault Access Failed</h1>
            <p>Check the Managed Identity, RBAC permissions, and Key Vault configuration.</p>
        `);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Application listening on port ${port}`);
});
