const connection = require('./connection');

const createUser = async (name, email, password, role) => {
  const userCreated = await connection()
    .then((db) => db.collection('users').insertOne({ name, email, password, role }))
    .then((result) => ({ user: { name, email, role, _id: result.insertedId } }));
  return userCreated;
};

const getAllUsers = async () => connection()
  .then((db) => db.collection('users').find().toArray());

const findByEmail = async (email) => {
  const emailFound = await connection()
  .then((db) => db.collection('users').findOne({ email }));
  return emailFound;
};

module.exports = {
  createUser,
  getAllUsers,
  findByEmail,
};
