import express from "express";
import basicAuth from "express-basic-auth";

const app = express();
const port = 3333;

const auth = basicAuth({
  users: { salem: "supercat123" },
  challenge: true,
});

app.get("/", auth, (req, res) => {
  res.sendFile(`${__dirname}/cats.html`);
});

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
