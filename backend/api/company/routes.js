import express from 'express';
const router = express.Router();
import {
    index,
    show,
    store,
    update,
    destroy
} from './controller';

router.get("/", index);
router.get("/:company", show);
router.post("/", store);
router.put("/:company", update);
router.delete("/:company", destroy);

export default router;