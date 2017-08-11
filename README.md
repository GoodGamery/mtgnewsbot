# MT. Gnewsbot
Generates random MTG news headlines

![Travis CI Build Status](https://travis-ci.org/GoodGamery/mtgnewsbot.svg?branch=master "Travis CI Build Status")

Twitter: https://twitter.com/MTGnewsbot

Submit a pull request with cool additions!

Command line use:

```
  Options:

    -V, --version         output the version number
    -c --count <n>        Count of news articles to generate
    -o --origin [string]  Origin string to flatten. Defaults to "#origin#"
    -v --verbose          Verbose logging
    -t --tweet            Tweet the result. Overrides count to 1.
    -d --discord          Post the result on discord
    --debug               Post the result on debugging discord channel
    -h, --help            output usage information
```

For example, to print out 10 messages:
`node mtgnews -c 10`

To make one tweet:
`node mtgnews --tweet`

To post on discord, but not twitter:
`node mtgnews --discord`

To use a custom rule and post it to twitter and discord:
`node mtgnews -o "#customRule#" --tweet --discord`

To be able to tweet or use discord, you need to create a config-override.json and fill in the following keys:

```
{
  "webhookUrlErr": "https://discordapp.com/api/webhooks/<SECRET>",
  "webhookUrl": "https://discordapp.com/api/webhooks/<SECRET>",
  "TWITTER_CONSUMER_KEY": "<SECRET>",
  "TWITTER_CONSUMER_SECRET": "<SECRET>",
  "TWITTER_ACCESS_TOKEN": "<SECRET>",
  "TWITTER_ACCESS_TOKEN_SECRET": "<SECRET>"
}
```
