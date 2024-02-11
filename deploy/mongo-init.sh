set -e

mongo <<EOF
use $MONGO_DATABASE
db.createUser({
  user: '$MONGO_USERNAME',
  pwd: '$MONGO_PASSWORD',
  roles: [{
    role: 'dbOwner',
    db: '$MONGO_DATABASE'
  }]
})
EOF