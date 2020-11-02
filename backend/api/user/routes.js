import express from 'express';
const router = express.Router();
import {
    signin,
    register
} from './controller';

router.post("/signin", signin);
router.post("/register", register);
export default router;