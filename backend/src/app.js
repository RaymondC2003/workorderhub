import express from "express";
import requestId from "./middleware/requestId.middleware.js";
import auth from "./middleware/auth.middleware.js";
import notFound from "./middleware/notfound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import workOrderRoutes from "./routes/workorders.routes.js";

const app = express();

app.use(express.json());
app.use(requestId);

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use(auth);
app.use("/api/workorders", workOrderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
