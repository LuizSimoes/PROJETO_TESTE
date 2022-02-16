const { Router } = require('express');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const {
  badRequest,
  created,
  OK,
  notFound,
  RecipeNotFound,
  noContent } = require('../utils/messages');
const validateToken = require('../auth/validateToken');
const service = require('../services/serviceRecipe');

const recipes = Router();

recipes.post('/', validateToken, async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  if (!name || !ingredients || !preparation) {
    return res.status(badRequest).json({ message: 'Invalid entries. Try again.' });
  }
  const { _id: userId } = req.user;
  const recipe = await service.recipeCreate(name, ingredients, preparation, userId);
  return res.status(created).json(recipe);
});

recipes.get('/', async (_req, res) => {
  const getAllRecipes = await service.getAllRecipes();
  return res.status(OK).json(getAllRecipes);
});

// https://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid
recipes.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(notFound).json(RecipeNotFound);
  const recipe = await service.getRecipeById(id);
  if (!recipe) return res.status(notFound).json(RecipeNotFound);
  return res.status(OK).json(recipe);
});

recipes.put('/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(notFound).json(RecipeNotFound);
  const { _id: userId } = req.user;
  const { name, ingredients, preparation } = req.body;
  const payload = { name, ingredients, preparation };
  const updatedRecipe = await service.updatedRecipe(id, payload, userId);
  return res.status(OK).json(updatedRecipe);
});

recipes.delete('/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(notFound).json(RecipeNotFound);
  await service.deleteRecipe(id);
  return res.status(noContent).json({ message: 'deleted' });
});

// Adição de imagem
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, _file, callback) => {
    const { id } = req.params;
    callback(null, `${id}.jpeg`);
  },
});
const upload = multer({ storage });
recipes.put('/:id/image', upload.single('image'), validateToken, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(notFound).json(RecipeNotFound);
  const recipeImage = await service.upload(id);
  return res.status(OK).json(recipeImage);
});

module.exports = recipes;
