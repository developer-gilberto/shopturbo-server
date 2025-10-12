import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const pathREADME = path.join(process.cwd(), "README.md");

export function docsController(_req: Request, res: Response) {
    const READMEcontent = fs.readFileSync(pathREADME, "utf-8");

    res.status(200).type("text/plain").send(READMEcontent);
    return;
}
