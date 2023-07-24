This package use @sha/configurable module.
You need to define the argument in npm script --data=DataFolder, or use the default one
After the launch app will check /Users/UserName/shaApps/smarteat-dev for win, 
U can find a similar folders structure in your *nix user's directory after the first launch


there will be config folder with json files, changing of the values there restarts the service with a new configuration

Use these folders for all the data (assets, logs, etc)

### How to run the service in debug mode###
Example for Win10

```
C:\work\btce\eos-front\node_modules\.bin\ts-node-dev.cmd --inspect-brk=62615 --transpileOnly --respawn C:\work\btce\eos-front\packages\btce-service\src\createMailer.ts --data=btce-debug
```
