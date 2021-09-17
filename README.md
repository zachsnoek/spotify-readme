# spotify-readme

Display your currently-playing Spotify song on your profile README. Inspired by [novatorem/novatorem](https://github.com/novatorem/novatorem).

|![](https://spotify-readme.azurewebsites.net/api/get-current-track)|
|-|

## Setup

-   Create an [Azure account](https://azure.microsoft.com/en-us/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)

-   Install [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cportal%2Cbash%2Ckeda#install-the-azure-functions-core-tools) and [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

-   Sign in to Azure with the CLI

    -   `az login`

-   Clone this repository

    -   `git clone https://github.com/zachsnoek/spotify-readme.git && cd spotify-readme/api`

-   Create a Spotify application

    -   Log in to [developer.spotify.com](https://developer.spotify.com) and navigate to your [Dashboard](https://developer.spotify.com/dashboard)
    -   Click "Create an App," enter a name and description, and click "Create"
    -   In the application's overview page, note the client ID and client secret
    -   Click "Edit Settings" and add `http://localhost/callback` as a redirect URI

-   Obtain a Spotify refresh token

    -   In a web browser, go to `https://accounts.spotify.com/authorize?client_id=<YOUR SPOTIFY CLIENT ID>&response_type=code&scope=user-read-currently-playing&redirect_uri=http://localhost/callback`, replacing `<YOUR SPOTIFY CLIENT ID>` with your client ID
    -   Click "Agree" when prompted; you will be redirected to `http://localhost/callback`
    -   Copy the value for the `code` query parameter in the URL; this is your authorization code
    -   Create a Base64-encoded string of your client ID and client secret separated by a colon (`<YOUR SPOTIFY CLIENT ID>:<YOUR SPOTIFY CLIENT SECRET>`) and copy the value
    -   Make the following request and copy the `refresh_token` in the response: `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic <YOUR BASE64-ENCODED STRING>" -d "grant_type=authorization_code&redirect_uri=http://localhost/callback&code=<YOUR CODE>" https://accounts.spotify.com/api/token`

-   Test the function locally

    -   Run `touch local.settings.json` and add the following settings, replacing the values of the `SPOTIFY`-prefixed keys with your own:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "",
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "SPOTIFY_CLIENT_ID": "<YOUR SPOTIFY CLIENT ID>",
            "SPOTIFY_CLIENT_SECRET": "<YOUR SPOTIFY CLIENT SECRET>",
            "SPOTIFY_REFRESH_TOKEN": "<YOUR SPOTIFY REFRESH TOKEN>"
        }
    }
    ```

    -   Run `npm i && npm start`
    -   Start playing a song on Spotify and make a GET request to `http://localhost:7071/api/get-current-track`

-   Deploy the function

    -   [Create a function app in your Azure subscription](https://docs.microsoft.com/en-us/azure/azure-functions/scripts/functions-cli-create-serverless) with the name `spotify-readme`
    -   Run `npm run publish`
    -   Navigate to the [application's settings in the Azure portal](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal#settings) and add your `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`

-   Add the image to your README
    -   `![](https://<YOUR DOMAIN>/api/get-current-track)`
