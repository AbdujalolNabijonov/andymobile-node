const env = require("dotenv");
const mongoose = require("mongoose");
const color = require("colors/safe");
env.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3001;

mongoose.set({ strictQuery: false });
mongoose
  .connect(MONGODB_URL)
  .then((data) => {
    console.log(color.bgBlue("Connected to the server!"));
    const server = require("./app");
    server.listen(
      PORT,
      console.info(
        color.bgCyan(`Backend server is running on ${process.env.NODE_ENV}`),
        color.bgMagenta(`http://localhost:${PORT}`)
      )
    );
  })
  .catch((err) =>
    console.log(color.bgRed(`MongoDb Connection error, ${err.message}`))
  );
