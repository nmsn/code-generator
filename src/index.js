import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import mustache from "mustache";
import {
  getTemplateName,
  selectTemplate,
  editTemplate,
  getOutputName,
} from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __curDir = process.cwd();

const tplDir = path.join(__dirname, "template");

const getOutput = async (template) => {
  const tpl = fs.readFileSync(`${tplDir}/${template}`, "utf-8");
  const slots = tpl.match(/(?<=\{\{\{)(\S+?)(?=\}\}\})/gm);
  const result = await editTemplate([...new Set(slots)]);
  const output = mustache.render(tpl, result);
  return output;
};

const saveFile = (filename, output) => {
  fs.writeFileSync(`${__curDir}/${filename}`, output);
};

const cli = async () => {
  const files = await getTemplateName(tplDir);
  const { template } = await selectTemplate(files);
  const output = await getOutput(template);
  const fileName = await getOutputName();
  saveFile(fileName, output);
};

cli();
