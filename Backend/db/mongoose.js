const mongoose = require('mongoose');

const connectionString =
  process.env.CONNECTIONSTRING || "mongodb://0.0.0.0:27017/DeliveryManager";

  mongoose
  .connect(connectionString,
    {"useNewURLParser":true,
  "useUnifiedTopology": true})
  .catch(error => {
    console.log(`Database connection refused ${error}`);
    process.exit(2);
  })


  const db = mongoose.connection;

  db.on("Error", console.error.bind(console, "Connection Error:"));

  db.once("open", () => {
    console.log("DB Connected");
  });