import express from "express";
import memeController from "../../../controller/api/v1/memeController";

const router = express.Router();

router.post("/", memeController.post);

router.get("/", memeController.getAll);
router.get("/tours-stats", memeController.getStats);
router.get("/:name", memeController.getOne);
router.get("/image/:id", memeController.image);

export default router;
