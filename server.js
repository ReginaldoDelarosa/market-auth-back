const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./dbfile");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const productsRoutes = require('./routes/products.routes');
const salesRoutes = require('./routes/sales.routes');

const app = express();

app.use(cookieParser());
app.use(cors({ 
  credentials: true, 
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(['http://localhost:5173', 'https://login-auth-two.vercel.app'].indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json({ limit: "10mb", extended: true }));

app.use('/api/products/',productsRoutes);

app.use('/api/sales/',salesRoutes);

app.use("/api/auth/", authRoutes);


app.listen(1200, function () {
  console.log(`Listening http://localhost:1200`);
});
