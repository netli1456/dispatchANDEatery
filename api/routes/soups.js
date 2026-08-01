import express from 'express';
import { createSoup } from '../controllers/soups.js';

const soupRouter = express.Router();

soupRouter.get('/', createSoup)

export default soupRouter