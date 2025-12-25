import express from "express";
import { currentUsage, billingSummary } from "../controllers/billing.controller";

const router = express.Router();

router.get("/:id/current-usage", currentUsage);
router.get("/:id/billing-summary", billingSummary);

export default router;
