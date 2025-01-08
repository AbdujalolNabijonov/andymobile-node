# PRODUCTION
git reset --hard
git checkout master
git pull origin master
npm i
pm2 start process.config.js --env production

# DEVELOPMENT
# pm2 start process.config --env development