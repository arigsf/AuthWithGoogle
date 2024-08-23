import express, { Express } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import UserRouter from "../src/domains/User/controllers/index"
import cors, { CorsOptions } from "cors";

config();

export const app: Express = express()

const options: CorsOptions = {
	credentials: true,
	origin: process.env.APP_URL
};

app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use("/api/users", UserRouter);