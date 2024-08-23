import { Router, Request, Response, NextFunction } from "express";
import { login, logout, verifyJWT, notLoggedIn, googleAuth } from "../../../middlewares/auth";
import UserService from "../services/UserService";
import statusCodes from "../../../../utils/constants/statusCodes";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/login/google", googleAuth);

router.post("/login", notLoggedIn, login);

router.post("/logout", verifyJWT, logout);

router.get("/protected", verifyJWT, (req: Request, res: Response, next: NextFunction) => {
	res.status(statusCodes.SUCCESS).json(req.user);
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.create(req.body);
		res.status(statusCodes.SUCCESS).json(user);
	} catch (error) {
		next(error);
	}
});

export default router;