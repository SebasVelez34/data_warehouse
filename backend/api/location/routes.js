import express from 'express';
const router = express.Router();
import {
    index,
    showRegion,
    storeRegion,
    storeCountry,
    storeCity,
    showCountry,
    showCity,
    update,
    destroy
} from './controller';

router.get("/", index);
router.get("/region/:region", showRegion);
router.get("/country/:country", showCountry);
router.get("/city/:city", showCity);
//router.post("/", store);
router.post("/region", storeRegion);
router.post("/country", storeCountry);
router.post("/city", storeCity);
router.put("/:location", update);
router.delete("/:location", destroy);

export default router;