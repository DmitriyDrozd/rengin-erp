# rengin-erp
```yarn start```

Run mongoDB somewhere and add it's credentials here
```packages/services/.app-config.yml```
into section 
```MONGO_URI:
    $env:
      default:
```
Do same with postgres or turn it off with option:
```
WRITE_PG:
    $env:
      default: false
```

**Start backend in dev mode**
* ```yarn service:start```

**Start frontend in dev mode**
* ```yarn front:start```

**Env variables `(development purpose)`:**
* ```7z``` - Use ```"C:\\Program Files\\7-Zip\\7z.exe"``` for 7z archive creation on Windows OS

**Server side commands to start processes:**
```
cd /home/rengin-erp/
```
* start Docker: MongoDB, PostGre
```
docker-compose-up
```
* Start backend and remove association with console window
```
nohup yarn service:watch &
disown [processId]
```

* Start frontend and remove association with console window
```
nohup yarn front:dev:watch &
disown [processId]
```

**Server side commands to build up the app**

Build front
```
cd /home/rengin-erp
yarn front:build:prod
yarn front:assets
```
Start backend
```
nohup yarn service:prod &
disown %process_id%
```

*pm2 commands*
init:
```
npm install pm2 -g
```

start service: 
```
pm2 start pm2.config.json
```