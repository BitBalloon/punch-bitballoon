Punch BitBalloon
----------------

A [Punch](http://laktek.github.com/punch) Publisher for BitBalloon.

Lets you deploy your Punch based sites straight to BitBalloon.

## How to Use

* install the package
    
        npm install punch-bitballoon
    
* Open your Punch project's configurations (`config.json`) and add the following:
    
        "plugins": {
          "publishers": {
            "bitballoon": "punch-bitballoon" 
          }
        }

* Also, you must define `publish` settings in the config.

        "publish" : {
          "strategy" : "bitballoon",
          "options" : {
            "access_token": "your-bitballoon-access-token",
            "site_id": "optional id or domain of an existing site to deploy to (ie. my-site.bitballoon.com)"
          }
        }

* Then, you can publish your site by running `punch publish` (or `punch p`) command.

## Getting an Access Token

If you don't have an access token, just leave the "options" empty the first time your run `punch p` and the plugin will prompt you for your API credentials and generate one for you.
