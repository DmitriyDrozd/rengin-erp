# rengin-erp
```yarn start```

Run mongoDB somwhere and add it's credentials here
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

Start backend in dev mode
```yarn service:start```
Start frontend in dev mode with
```yarn front:start```