import path from "path";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";

import cluster from "cluster";
import os from "os";
import cors from "cors";
import http from "http";
import https from "https";
import { fileURLToPath } from "url";
import { OAuth2Client } from "google-auth-library";
import db from "./app/models/index.js";
import authRoutes from './app/routes/auth.routes.js';
import profileRoutes from './app/routes/profile.routes.js';

const totalCPUs = os.cpus().length;
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  var options = {};

  const app = express();
  const googleOAthClient = new OAuth2Client(process.env.GG_CLIENTID);

  app.use(cors());
  // allow json post requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // serve build files to static
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  // connect mongoose
  db.mongoose.connect("mongodb://localhost:27017/soundscape").then(function () {
    console.log('successfully connected to db');
    // TODO: test user
  }).catch((error) => { console.error(error); process.exit(); })

  // endpoint routes here
  const authOptions = { clientId: process.env.GG_CLIENTID };
  app.use('*', function(req, res, next) {
    req.options = authOptions;
    req.oAuthClient = googleOAthClient;
    next()
  })

  app.use('/app/auth', authRoutes);
  app.use('/app/me', profileRoutes);

  // All other GET requests not handled before will return our React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  http.createServer(app).listen(80)
  https.createServer(options, app).listen(433);
}
