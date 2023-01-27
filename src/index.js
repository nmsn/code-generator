import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import {
  removeMultipleStrLeadingSpace,
  getTemplateName,
  selectTemplate,
} from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* --- function --- */

const AP = path.join(__dirname, "function");
const RP = "./function";

const asyncImport = async (filename = "template.js", template) => {
  const { default: getTemplate } = await import(`${RP}/${template}`);

  fs.writeFileSync(
    `./${filename}`,
    removeMultipleStrLeadingSpace(getTemplate())
  );
};

const cli = async () => {
  const files = await getTemplateName(AP);
  const { template } = await selectTemplate(files);
  asyncImport(undefined, template);
};

/* --- copy --- */

const AP2 = path.join(__dirname, "source");

const copyImport = async (filename = "template.js", template) => {
  fs.copyFileSync(`${AP2}/${template}`, `./${filename}`);
};

const cli2 = async () => {
  const files = await getTemplateName(AP2);
  const { template } = await selectTemplate(files);
  copyImport(undefined, template);
};

/* --- mustache --- */
