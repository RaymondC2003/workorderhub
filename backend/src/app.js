import express from "express";
import cors from "cors";
import requestId from "./middleware/requestId.middleware.js";
import auth from "./middleware/auth.middleware.js";
import notFound from "./middleware/notfound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json());
app.use(requestId);

app.get("/health", (req, res) => {
  res.json({
    requestId: req.requestId,
    status: "ok",
    time: new Date().toISOString()
  });
});

app.use(auth);
app.use("/api/v1", indexRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
