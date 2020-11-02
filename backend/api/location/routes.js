import express from 'express';
const router = express.Router();
import {
    index,
    showRegion,
    showCountry,
    showCity,
    store,
    update,
    destroy
} from './controller';

router.get("/", index);
router.get("/region/:region", showRegion);
router.get("/country/:country", showCountry);
router.get("/city/:city", showCity);
router.post("/", store);
router.put("/:location", update);
router.delete("/:location", destroy);

export default router;