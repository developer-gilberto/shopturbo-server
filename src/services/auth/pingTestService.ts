import { Response } from "express";
import { ExtendedRequest } from "../../interfaces/usersInterfaces";

export function pingTestService(req: ExtendedRequest, res: Response) {
    console.info("Logged userName: ", req.loggedUser?.name);

    res.status(200).json({
        error: false,
        message: "pong",
    });
}
