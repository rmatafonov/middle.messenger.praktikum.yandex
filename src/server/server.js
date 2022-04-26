const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("./dist"));
app.use('/*', express.static("./dist"));

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});
