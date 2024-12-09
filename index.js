// const express = require("express");
// const app = express();
// require("dotenv").config();
// const dbConfig = require("./config/dbConfig");
// app.use(express.json());
// const userRoute = require("./routes/userRoute");
// const path = require("path");
// const cors = require("cors");

// app.use("/api/user", userRoute);

// // Configure CORS
// app.use(cors({
//   origin: "http://localhost:5173", // Replace with the frontend origin
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));


// const port = process.env.PORT || 5000;

// app.get("/", (req, res) => res.send("Hello World!"));
// app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));

// const express = require("express");
// const app = express();
// require("dotenv").config();
// const dbConfig = require("./config/dbConfig");
// const userRoute = require("./routes/userRoute");
// const path = require("path");
// const cors = require("cors");

// // Configure CORS - place this before defining any routes
// app.options("*", cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json());

// // Define routes
// app.use("/api/user", userRoute);

// const port = process.env.PORT || 5000;

// app.get("/", (req, res) => res.send("Hello World!"));
// app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));


const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const userRoute = require("./routes/userRoute");
const path = require("path");
const cors = require("cors");

// Comprehensive CORS configuration
const corsOptions = {
  origin: 'https://pavith-recipe-app.netlify.app', // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Important for handling cookies and authentication
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parsing middleware
app.use(express.json());

// Define routes
app.use("/api/user", userRoute);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));