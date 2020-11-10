import express from 'express';
const router = express.Router();
import {
    index,
    store,
    show,
    update,
    destroy
} from './controller';

router.get("/", index);
router.get("/:contact", show);
router.post("/", store);
router.put("/:contact", update);
router.delete("/:contact", destroy);

export default router;