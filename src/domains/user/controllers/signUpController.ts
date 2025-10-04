import { Request, Response } from "express";
import { signUpSchema } from "../schemas/signUpSchema";
import { IRequestBody } from "../interfaces/userInterfaces";
import { UserRepository } from "../repositories/userRepository";
import { generateJWT } from "../../../infra/authentication/generateJWT";

export async function signUp(
    req: Request<{}, {}, IRequestBody>,
    res: Response,
) {
    try {
        const safeData = signUpSchema().safeParse(req.body);

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        const userRepo = new UserRepository();

        const storedUser = await userRepo.getUserByEmail(safeData.data.email);

        if (storedUser.error) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to search for a user in the database.",
            });
            return;
        }

        if (storedUser.data) {
            res.status(409).json({
                error: true,
                message: "Error! Try a different email.",
            });
            return;
        }

        const newUser = await userRepo.save(safeData.data);

        if (newUser.error) {
            res.status(500).json({
                error: true,
                message: "Error trying to register account in the database.",
            });
            return;
        }

        const token = generateJWT(newUser.data!);

        if (!token) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to generate the token.",
            });
            return;
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000, // 1dia
            //maxAge: 30000 // 30s
            // sameSite: "none",
        });

        res.status(201).json({
            error: false,
            message: "Account created successfully :)",
        });
        return;
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to create the account: \x1b[0m\n",
            err,
        );
        res.status(500).json({
            error: true,
            message: "An error occurred while trying to create the account :(",
        });
        return;
    }
}
