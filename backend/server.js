const express = require("express");
const cors = require("cors");
const countryRoutes = require("./routes/countryRoutes");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", countryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
