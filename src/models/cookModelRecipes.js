const { ObjectId } = require('mongodb');
const connection = require('./connection');

const recipeCreate = async (name, ingredients, preparation, userId) => {
  const recipeCreated = await connection()
  .then((db) => db.collection('recipes').insertOne({ name, ingredients, preparation, userId }))
  .then((result) => ({ recipe:
    { name, ingredients, preparation, userId, _id: result.insertedId } }));
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

const updateRecipe = async (id, payload, userId) => {
  const { name, ingredients, preparation } = payload;
  await connection().then((db) => db.collection('recipes').updateOne(
    { _id: ObjectId(id) },
    { $set: {
      name,
      ingredients,
      preparation,
    } },
  ));
  return {
    _id: id,
    name,
    ingredients,
    preparation,
    userId,
  };
};

const deleteRecipe = async (id) => {
  connection().then((db) => db.collection('recipes').deleteOne({ _id: ObjectId(id) }));
};

const upload = async (id, recipe) => {
  const image = await connection().then((db) => db.collection('recipes').updateOne(
    { _id: ObjectId(id) },
    { $set: {
      image: `localhost:3000/images/${id}.jpeg`,
     } },
  ).then(() => ({ image: `localhost:3000/images/${id}.jpeg` })));
  return { ...recipe, ...image };
};

module.exports = {
  recipeCreate,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  upload,
};
