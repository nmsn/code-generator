import fs from "fs";
import inquirer from "inquirer";
import mustache from "mustache";
import process from "process";

const __curDir = process.cwd();

export const editTemplate = async (names) => {
  const result = await inquirer.prompt(
    names.map((item) => ({
      type: "input",
      name: item,
      message: `Input variable ${item}:`,
    }))
  );

  return result;
};

export const getTpl = async (path) => {
  const files = fs.readdirSync(path);

  const { template: sourceTpl } = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Select the template of code:",
      choices: files.map((item) => ({ value: item, name: item })),
    },
  ]);

  const tpl = fs.readFileSync(`${path}/${sourceTpl}`, "utf-8");
  const slots = tpl.match(/(?<=\{\{\{)(\S+?)(?=\}\}\})/gm);
  const result = await editTemplate([...new Set(slots)]);
  const output = mustache.render(tpl, result);
  return output;
};

export const getOutputFileName = async () => {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: `Input output file name:`,
  });

  return name;
};

export const saveFile = (filename, output) => {
  fs.writeFileSync(`${__curDir}/${filename}`, output);
};
