import express from "express";
import { recordUsage } from "../controllers/usage.controller";

const router = express.Router();

router.post("/", recordUsage);

export default router;
