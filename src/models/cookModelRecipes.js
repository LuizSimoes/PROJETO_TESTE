const { ObjectId } = require('mongodb');
const connection = require('./connection');

const recipeCreate = async (name, ingredients, preparation, userId) => {
  console.log(name, ingredients, preparation, userId);
  const recipeCreated = await connection()
  .then((db) => db.collection('recipes').insertOne({ name, ingredients, preparation, userId }))
  .then((result) => ({ recipe:
    { name, ingredients, preparation, userId, _id: result.insertedId } }));
    console.log(name, ingredients, preparation, userId);
  return recipeCreated;
};

const getAllRecipes = async () => {
  const allRecipes = await connection()
  .then((db) => db.collection('recipes').find().toArray());
  return allRecipes;
};

const getRecipeById = async (id) => {
  const recipe = await connection().then((db) => db.collection('recipes').findOne(ObjectId(id)));
  if (!recipe) return null;
  const { name, ingredients, preparation, userId } = recipe;
  return { _id: id, name, ingredients, preparation, userId };
};

module.exports = {
  recipeCreate,
  getAllRecipes,
  getRecipeById,
};
