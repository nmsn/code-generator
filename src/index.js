import fs from "fs";
import inquirer from "inquirer";

const getTemplateName = () => {
  const files = fs.readdirSync("./src/template");
  console.log(files);
  selectTemplate(files);
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
};

const writeFile = (filename) => {
  fs.writeFile(`./${filename}`, import("./template/Drawer.js")());
};

const asyncImport = async (filename) => {
  const { default: myDefault, foo, bar } = await import("./template/Drawer.js");

  fs.writeFileSync(`./${filename}`, removeMultipleStrLeadingSpace(myDefault()));
};

const removeMultipleStrLeadingSpace = (strTemplate, keepBlankRow = true) => {
  if (!strTemplate) {
    return "";
  }
  if (keepBlankRow) {
    return strTemplate.replace(/^[^\S\n]+/gm, '');
  }
  return strTemplate.replace(/^\s+/gm, "");
};

asyncImport('test.js');