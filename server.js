const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/dist`));
app.get('*', (_req, resp) => {
  resp.sendFile(`${__dirname}/dist/index.html`);
})

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});
