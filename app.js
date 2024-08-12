process.on('uncaughtException', (err) => {
  console.log("uncaughtException", err);
})
import express from "express";
import { config } from "dotenv";

import morgan from "morgan";
import AppError from "./src/utils/HandelError/appError/APPERROR.js";
import { middleWareHandlerErrorFun } from "./src/utils/HandelError/middleWareHandelError/middleWareHandlerError.js";
import { routes } from "./src/utils/refactorRoutesApi/routesApi.js";
import { dbCOnnection } from "./src/dataBase/dbConnection.js";
import cors from 'cors';

config({ path: "./config/.env" });
const app = express();
app.use(cors())
const port = process.env.PORT || 5000;
// middleWare
process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : ''
app.use(express.json());
app.use(express.static('./src/uploads'))
routes(app)
app.all("*", (req, res, next) => {
  next(new AppError(`can not find this ${req.originalUrl} on server`, 201))
})
app.use(middleWareHandlerErrorFun)
// DB
dbCOnnection()
// *************** 
app.listen(port, () => {
  console.log(`running server ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
})
