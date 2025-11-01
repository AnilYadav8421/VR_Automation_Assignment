import express from "express";
import { saveHistory, getCoinHistory } from "../controllers/coinController.js";

const router = express.Router();

router.post("/", saveHistory);
router.get("/:coinId", getCoinHistory);

export default router;
