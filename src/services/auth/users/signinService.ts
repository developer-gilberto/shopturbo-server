import { Request, Response } from "express";
import { IReqBody } from "../../../interfaces/usersInterfaces";
import { signinSchema } from "../../../schemas/signinSchema";
import { UsersRepository } from "../../../repositories/usersRepository";
import { comparePassword } from "../../../helpers/hashHelper";
import { generateJWT } from "../../../helpers/jwtHelper";

export async function signIn(req: Request<{}, {}, IReqBody>, res: Response) {
    try {
        const safeData = signinSchema().safeParse(req.body);

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        const userRepo = new UsersRepository();

        const storedUser = await userRepo.getUserByEmail(safeData.data.email);

        if (storedUser.error) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to search for a user in the database.",
            });
            return;
        }

        if (!storedUser.data) {
            res.status(401).json({
                error: true,
                message: "Incorrect email and/or password. Access denied.",
            });
            return;
        }

        const result = await comparePassword(
            safeData.data.password,
            storedUser.data.password,
        );

        if (result.error) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to check the password.",
            });
            return;
        }

        if (!result.match) {
            res.status(401).json({
                error: true,
                message: "Incorrect email and/or password. Access denied.",
            });
            return;
        }

        const authToken = generateJWT(storedUser.data);

        if (!authToken) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to generate the token.",
            });
            return;
        }

        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production" || "homolog"
                    ? true
                    : false,
            sameSite: "none",
            //   maxAge: response.data.expire_in * 1000, // Em milissegundos
        });

        res.status(200).json({
            error: false,
            message: "Successful login :)",
            authToken,
        });
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to login: \x1b[0m\n",
            err,
        );
        res.status(500).json({
            error: true,
            message: "An error occurred while trying to login :(",
        });
    }
}
