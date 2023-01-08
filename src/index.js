import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { removeMultipleStrLeadingSpace } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AP = path.join(__dirname, "template");
const RP = "./template";

const getTemplateName = async (path) => {
  const files = fs.readdirSync(path);
  return files;
};

const selectTemplate = async (fileNames) => {
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Select the template of code",
      choices: fileNames.map((item) => ({ value: item, name: item })),
    },
  ]);

  return result;
};

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

const AP2 = path.join(__dirname, "source");

const copyImport = async (filename = "template.js", template) => {
  fs.copyFileSync(`${AP2}/${template}`, `./${filename}`);
};

const cli2 = async () => {
  const files = await getTemplateName(AP2);
  const { template } = await selectTemplate(files);
  copyImport(undefined, template);
};

cli2();
