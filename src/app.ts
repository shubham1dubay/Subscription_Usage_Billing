import express from "express";
import usageRoutes from "./routes/usage.routes";
import billingRoutes from "./routes/billing.routes";

const app = express();
app.use(express.json());

app.use("/usage", usageRoutes);
app.use("/users", billingRoutes);

export default app;
