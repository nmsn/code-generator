import fs from "fs";
import inquirer from "inquirer";
import mustache from "mustache";
import process from "process";

const __curDir = process.cwd();

export const editTemplate = async (names) => {
  const result = await inquirer.prompt(
    names.map(([name, defaultVal]) => ({
      type: "input",
      name: name,
      message: `Input variable ${name}:`,
      validate: (input) => {
        return !!(typeof input === "string" && input.length);
      },
      default: defaultVal ?? undefined,
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

  // 使用 ':' 对属性增加默认值
  const validSlots = await editTemplate(
    [...new Set(slots)].map((item) => item.split(":"))
  );
  console.log(tpl.replace(/\:(\S+?)(?=\}\}\})/g, ""));
  const output = mustache.render(
    tpl.replace(/\:(\S+?)(?=\}\}\})/g, ""),
    validSlots
  );
  return output;
};

export const getOutputFileName = async () => {
  const { name } = await inquirer.prompt({
    type: "input",
    name: "name",
    message: `Input output file name:`,
    validate: (input) => {
      return !!(typeof input === "string" && input.length);
    },

    // TODO 默认文件名是否需要使用模版的名称
    default: "index.tsx",
  });

  return name;
};

export const saveFile = (filename, output) => {
  fs.writeFileSync(`${__curDir}/${filename}`, output);
};
