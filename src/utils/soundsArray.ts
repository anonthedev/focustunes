import fs from "fs";
import path from "path";

const publicFolderPath = path.join(process.cwd(), "./public/sounds");
const files = fs.readdirSync(publicFolderPath);

export { files };
