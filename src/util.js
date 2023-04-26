import fs from "fs";
import inquirer from "inquirer";
·// TODO 替换 mustache
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

  // 去重并获取初始值
  const filterSlots = [...new Set(slots)].map((item) => item.split(":"));
  // 使用 ':' 对属性增加默认值
  const validSlots = await editTemplate(filterSlots);

  // TODO 当前识别大小写变量为不同变量，需整合视为同一变量，然后赋值后分别赋值为小写变量和大写开头变量（需考虑存在初始值的情况）
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
