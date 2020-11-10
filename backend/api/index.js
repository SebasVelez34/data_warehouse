import express from 'express';
import userRoutes from './user';
import companyRoutes from './company';
import locationRoutes from './location';
import contactRoutes from './contact';
const genericRoutes = express.Router();

genericRoutes.use('/user', userRoutes);
genericRoutes.use('/company', companyRoutes);
genericRoutes.use('/location', locationRoutes);
genericRoutes.use('/contact', contactRoutes);

export default genericRoutes;