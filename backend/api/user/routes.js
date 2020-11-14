import express from "express";
const router = express.Router();
import { isAuth } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/isAdmin";
import { signin, register, index, show, update, destroy } from "./controller";

router.get("/", [isAuth, isAdmin], index);
router.get("/:user", [isAuth, isAdmin], show);
router.delete("/:user", [isAuth, isAdmin], destroy);
router.put("/:user", [isAuth, isAdmin], update);
router.post("/signin", signin);
router.post("/register", [isAuth, isAdmin], register);
export default router;
