import fs from "fs";
import inquirer from "inquirer";

export const getTemplateName = async (path) => {
  const files = fs.readdirSync(path);
  return files;
};

export const selectTemplate = async (fileNames) => {
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Select the template of code:",
      choices: fileNames.map((item) => ({ value: item, name: item })),
    },
  ]);

  return result;
};

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

export const getOutputName = async () => {
  const result = await inquirer.prompt({
    type: "input",
    name: "name",
    message: `Input output file name:`,
  });

  return result.name;
};
