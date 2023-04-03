const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('blackjack').collection('user');
const scoreCollection = client.db('blackjack').collection('score');

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    balance: 100,
  };
  await userCollection.insertOne(user);

  return user;
}

function addScore(score) {
  scoreCollection.updateOne({name: score.name},{$set: {score: score.score, date: score.date}}).then((value) => {
    if(value.modifiedCount !== 1){
      scoreCollection.insertOne(score);
    }
  });

}

function getHighScores() {
  const query = {};
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

function getBalance(userName){
  return userCollection.findOne({ email: userName });
}

function updateBalance(body){
  return userCollection.updateOne({email: body.name},{$set: {balance: body.score}});

}

module.exports = {
  updateBalance,
  getUser,
  getUserByToken,
  createUser,
  addScore,
  getHighScores,
  getBalance,
};