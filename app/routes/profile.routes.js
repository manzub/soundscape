import { Router } from 'express';
import { getProfile, addToFavoriteGenres } from '../controller/profileController.js';

const router = Router()
router.get('/profile/:email', getProfile);
router.post('/profile/add-to-favorite-genres', addToFavoriteGenres)

export default Router;