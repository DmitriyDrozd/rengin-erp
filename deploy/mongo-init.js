print("Started Adding the Users.");
print('process.env',JSON.stringify(process.env))
db = db.getSiblingDB('local_dev');
db.createCollection('events')
db = db.getSiblingDB('dev');
db.createCollection('events')
db = db.getSiblingDB('prod');
db.createCollection('events')
db.getSiblingDB('dev').createUser(
    {
        user: "dev",
        pwd: "BuildMeUp",
        roles: [{"role":"dbOwner",db:"dev"}]
    }
);
db.getSiblingDB('prod').createUser(
    {
        user: "dev",
        pwd: "BuildMeUp",
        roles: [{"role":"dbOwner",db:"prod"}]
    }
);
db.getSiblingDB('local_dev').createUser(
    {
        user: "dev",
        pwd: "BuildMeUp",
        roles: [{"role":"dbOwner",db:"local_dev"}]
    }
);




print("End Adding the User Roles.");