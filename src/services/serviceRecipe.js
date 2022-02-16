const model = require('../models/cookModelRecipes');

const recipeCreate = async (name, ingredients, preparation, userId) => {
  const newRecipe = await model.recipeCreate(name, ingredients, preparation, userId);
  return newRecipe;
};

const getAllRecipes = async () => {
  const recipes = await model.getAllRecipes();
  return recipes;
};

const getRecipeById = async (id) => {
  const recipe = await model.getRecipeById(id);
  return recipe;
};
const updatedRecipe = async (id, payload, userId) => {
  const recipeUpdate = await model.updateRecipe(id, payload, userId);
  return recipeUpdate;
};

const deleteRecipe = async (id) => { await model.deleteRecipe(id); };

const upload = async (id) => {
  const recipe = await getRecipeById(id);
  const recipeWithImage = await model.upload(id, recipe);
  return recipeWithImage;
};

module.exports = {
  recipeCreate,
  getAllRecipes,
  getRecipeById,
  updatedRecipe,
  deleteRecipe,
  upload,
};
