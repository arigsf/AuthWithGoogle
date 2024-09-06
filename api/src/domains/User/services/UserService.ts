import prisma from "../../../../config/prismaClient";
import { hash } from "bcrypt"
import { User } from "@prisma/client";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";

class UserService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await hash(password, saltRounds);
		return encrypted;
	}

	async create(body: User) {
		if (body.email == null || body.password == null || body.name == null) {
			throw new InvalidParamError("Algum dado não foi informado!");
		}

		const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});

		if (checkUser) {
			throw new QueryError("Esse email já está cadastrado!");
		}

		const encrypted = await this.encryptPassword(body.password);

		const user = await prisma.user.create({
			data: {
				name: body.name,
				email: body.email,
				password: encrypted,
			}
		});

		return user;
	}

	async upsertGoogleUser(googleId: string, name: string | undefined, email: string) {
		if (!name) {
			name = "Usuário do Google"	
		}

		return await prisma.user.upsert({
			where: { googleId },
			update: { email },
			create: { googleId, name, email }
		});
	}

	async getById(id: number) {
		return await prisma.user.findUnique({
			where: { id: id }
		});
	}
}

export default new UserService();