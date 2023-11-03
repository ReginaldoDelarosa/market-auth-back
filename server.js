const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./db");
const authRoutes = require("./routes/auth");
const cors = require("cors");

const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin:"https://login-auth-1po8o70bl-reginaldodelarosa.vercel.app" }));
app.use(express.json({ limit: "10mb", extended: true }));
app.use("/", authRoutes);

app.listen(1200, function () {
  console.log(`Listening http://localhost:1200`);
});
