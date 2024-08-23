import prisma from "../../config/prismaClient";
import { Request, Response, NextFunction } from "express";
import { PermissionError } from "../../errors/PermissionError";
import { compare } from "bcrypt";
import statusCodes from "../../utils/constants/statusCodes";
import { User } from "@prisma/client";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { TokenError } from "../../errors/TokenError";
import { LoginError } from "../../errors/LoginError";
import UserService from "../domains/User/services/UserService";
import client from "../../config/authClient";

function generateJWT(user: Partial<User>, res: Response) {
	const body = {
		id: user.id,
		email: user.email,
		name: user.name
	};

	const token = sign({ user: body }, process.env.SECRET_KEY || "", { expiresIn: process.env.JWT_EXPIRATION });

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development"
	});
}

function cookieExtractor(req: Request) {
	let token = null;
	if (req.cookies) {
		token = req.cookies["jwt"];
	}
	return token;
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
	try {
		const token = cookieExtractor(req);

		if (token) {
			const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
			req.user = decoded.user;
		}

		if (req.user == null) {
			throw new TokenError("Você precisa estar logado para realizar essa ação!");
		}

		next();
	} catch (error) {
		next(error);
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email
			}
		});

		if (!user) {
			throw new PermissionError("Email e/ou senha incorretos!");
		}

		let match = false;
		if (user.password) {
			match = await compare(req.body.password, user.password);
		}

		if (!match) {
			throw new PermissionError("Email e/ou senha incorretos!");
		}

		generateJWT(user, res);

		res.status(statusCodes.NO_CONTENT).json("Login realizado com sucesso!");
	} catch (error) {
		next(error);
	}
}

export async function googleAuth(req: Request, res: Response, next: NextFunction) {
	try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(statusCodes.BAD_REQUEST).json("Token inválido!");
        }

        const user = await UserService.upsertGoogleUser(payload.sub, payload.name, payload.email);

        generateJWT(user, res);

		res.status(statusCodes.SUCCESS).json("Login realizado com o Google!");
    } catch (error) {
        next(error);
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		const token = cookieExtractor(req);
		if (!token) {
			throw new TokenError('Você não está logado no sistema!');
		}
		res.clearCookie('jwt');
		res.status(statusCodes.SUCCESS).json('Logout realizado com sucesso!');
	}
	catch (err) {
		next(err);
	}
}
export function notLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {
		const token = cookieExtractor(req);

		if (token) {
			const decoded = verify(token, process.env.SECRET_KEY || '');
			if (decoded) {
				throw new LoginError('Você já está logado no sistema!');
			}
		}
		next();
	} catch (error) {
		next(error);
	}
}