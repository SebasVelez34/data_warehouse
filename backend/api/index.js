import express from 'express';
import userRoutes from './user';
import companyRoutes from './company';
import locationRoutes from './location';
import contactRoutes from './contact';
import { isAuth } from '../middlewares/auth';
const genericRoutes = express.Router();

genericRoutes.use('/user',userRoutes);
genericRoutes.use('/company', isAuth , companyRoutes);
genericRoutes.use('/location',isAuth, locationRoutes);
genericRoutes.use('/contact', isAuth , contactRoutes);

export default genericRoutes;