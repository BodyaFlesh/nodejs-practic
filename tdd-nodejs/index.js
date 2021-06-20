const app = require('./src/app');
const sequelize = require('./src/config/database');
const User = require('./src/user/User');

const addUsers = async (activeUserCount, inactiveUserCount = 0) => {
  for(let i = 0; i < activeUserCount + inactiveUserCount; i++){
    await User.create({
      username: `user${i}`,
      email: `user${i}@mail.com`,
      inactive: i >= activeUserCount,
    });
  }
};

sequelize.sync({ force: true }).then(async () => {
  await addUsers(25);
});

app.listen(3000, () => console.log('app is running'));
