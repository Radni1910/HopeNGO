const express = require("express"),
  cors = require("cors"),
  app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/api"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.listen(process.env.PORT || 5000, () =>
  console.log(
    "Backend running on http://localhost:" + (process.env.PORT || 5000),
  ),
);
