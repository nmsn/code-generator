import fs from "fs";
import inquirer from "inquirer";
import { removeMultipleStrLeadingSpace } from "./util.js";

const BASE_PATH = "./src/template";
const IMPORT_PATH = "./template";

const getTemplateName = async (path = BASE_PATH) => {
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

  console.log(result);
  return result;
};

const asyncImport = async (filename = "template.js", template) => {
  const { default: getTemplate } = await import(`${IMPORT_PATH}/${template}`);

  fs.writeFileSync(
    `./${filename}`,
    removeMultipleStrLeadingSpace(getTemplate())
  );
};

const cli = async () => {
  const files = await getTemplateName();
  const { template } = await selectTemplate(files);
  asyncImport(undefined, template);
};

cli();
