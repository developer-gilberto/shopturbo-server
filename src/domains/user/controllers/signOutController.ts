import { Request, Response } from "express";

export async function signOut(_req: Request, res: Response) {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
        });

        res.status(200).json({
            error: false,
            message: "Signed out successfully. Bye!",
        });
        return;
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to SignOut: \x1b[0m\n",
            err,
        );
        res.status(500).json({
            error: true,
            message: "An error occurred while trying to SignOut :(",
        });
        return;
    }
}
