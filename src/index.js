import path from "path";
import { fileURLToPath } from "url";

import { getOutputFileName, getTpl, saveFile } from "./util.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tplDir = path.join(__dirname, "template");

const cli = async () => {
  const output = await getTpl(tplDir);
  const fileName = await getOutputFileName();
  saveFile(fileName, output);
};

cli();
