const express = require("express");
const requestId = require("./middleware/requestId.middleware");
const auth = require("./middleware/auth.middleware");
const notFound = require("./middleware/notfound.middleware");
const errorHandler = require("./middleware/error.middleware");

const workOrderRoutes = require("./routes/workorders.routes");

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

module.exports = app;