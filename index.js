process.on("uncaughtException", (err) => {
  console.log("error", err);
});
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { dbConnection } from "./database/dbconnection.js";
import { userRouter } from "./src/modules/user/user.router.js";
import { AppError } from "./src/utils/AppError.js";
import { globalErrorMiddleWare } from "./src/utils/globalErrorMiddleware.js";
import { bookRouter } from "./src/modules/book/book.router.js";
const app = express();
const port = 4000 || 4001;
app.use(express.json());
app.use("/users", userRouter);
app.use('/books',bookRouter)
app.get("/home", (req, res) => res.send("Hello World!"));
app.all("*", (req, res, next) => {
  next(
    new AppError(
      "invalid url-can't access this endpoint" + req.originalUrl,
      404
    )
  );
});
app.use(globalErrorMiddleWare);
dbConnection();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
process.on("unhandledRejection", (err) => {
  console.log("error", err);
});

// app.use(function (err, req, res, next) {
//   res.status(500).json({err:err.message});
// });

// res.status(404).json({ message: "invalid url" +req.originalUrl});
// next(new Error());
