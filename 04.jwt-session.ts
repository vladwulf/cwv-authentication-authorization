import express, { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const app = express();
const port = 3333;
const jwtSecret = "keyboard cat";

const users: Record<string, string> = {
  salem: "supercat123",
};

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers?.authorization;
  if (!authorizationHeader) return res.status(401).send("Unauthorized");

  try {
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    res.locals.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

app.get("/", auth, (req, res) => {
  res.sendFile(`${__dirname}/cats.html`);
});

app.post("/signin", (req, res) => {
  const username: string = req.body?.username;
  const password: string = req.body?.password;

  if (!username) return res.status(403).send("Credentials incorrect");

  const pw = users[username];
  if (pw !== password) return res.status(403).send("Credentials incorrect");

  const accessToken = jwt.sign(
    {
      username,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    accessToken,
  });
});

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
