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
    updateRegion,
    updateCountry,
    updateCity,
    destroyRegion,
    destroyCountry,
    destroyCity,
    cities
} from './controller';

router.get("/", index);
router.get("/cities", cities);
router.get("/region/:region", showRegion);
router.get("/country/:country", showCountry);
router.get("/city/:city", showCity);
router.post("/region", storeRegion);
router.post("/country", storeCountry);
router.post("/city", storeCity);
router.put("/region/:region", updateRegion);
router.put("/country/:country", updateCountry);
router.put("/city/:city", updateCity);
router.delete("/region/:region", destroyRegion);
router.delete("/country/:country", destroyCountry);
router.delete("/city/:city", destroyCity);

export default router;