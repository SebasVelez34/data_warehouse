import express from 'express';
const router = express.Router();
import {
    signin,
    register,
    index,
    show,
    update,
    destroy
} from './controller';

router.get("/",index);
router.get("/:user",show);
router.delete("/:user",destroy);
router.put("/:user",update);
router.post("/signin", signin);
router.post("/register", register);
export default router;