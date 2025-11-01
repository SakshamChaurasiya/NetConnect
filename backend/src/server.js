const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");


dotenv.config();

dbConnect();

const app = express();

const allowedOrigin = (process.env.CLIENT_URL || "").replace(/\/$/, ""); // remove trailing slash if exists

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());



const PORT = process.env.PORT || 5000;


app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})