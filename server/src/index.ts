import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dispatcher from './dispatcher';
import mongoose from 'mongoose';
import helpers from './helpers';

const password = process.env.ADMIN_PASSWORD || 'test';
const secret = 'test';

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo/ohack'
mongoose.connect(mongoUrl);

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', express.static('public'));

app.post('/login', (req: Request, res: Response) => {
  console.log(req);
  if (req.body.password == password) {
    res.cookie('authorization', secret, {
    });
    res.sendStatus(201);
  } else {
    res.sendStatus(401);
  }
});

app.use((req: Request, res: Response, next) => {
  if (req.headers.authorization == secret || req.cookies.authorization == secret) {
    next();
  } else {
    res.sendStatus(401);
  }
});

app.get('/testing', (req: Request, res: Response) => {
  res.send("Hello, josh!").status(200);
  dispatcher.sms.sendMessage("Hello!!!", { phoneNumber: "+12092757002" })
});

try {
  helpers.routing(app);

  app.use((err: any, req: Request, res: Response, next: any) => {
    console.log(err);

    res.status(500).send(err.message);
  })
} catch (err) {
  console.error(err);
}

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
