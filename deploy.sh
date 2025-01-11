# PRODUCTION
git reset --hard
git checkout master
git pull origin master
# npm i
# pm2 start process.config.js --env production
docker compose up -d

# DEVELOPMENT
# pm2 start process.config --env development