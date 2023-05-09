import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";
// TODO 替换 mustache
import mustache from "mustache";
import process from "process";

const __curDir = process.cwd();

const colorSubText = (text: string) => {
  return chalk.dim.cyan(text);
};

type NameType = {
  name: string;
  defaultVal: string;
  hasTwo?: boolean;
};

export const editTemplate = async (names: NameType[]) => {
  const params = await inquirer.prompt(
    names.map(({ name, defaultVal, hasTwo }) => ({
      type: "input",
      name: name,
      message: `Input variable ${name}:`,
      validate: (input) => {
        if (typeof input === "string" && !input.length) {
          return `Please input valid param value.${colorSubText(
            "(请输入有效参数)"
          )}`;
        }

        if (hasTwo && isFirstUpperCase(input)) {
          return `Please use lower case param.${colorSubText(
            "(请使用小写字母开头的参数)"
          )}`;
        }

        if (isFirstUpperCase(input) && !isFirstUpperCase(name)) {
          return `Please use lower case param.${colorSubText(
            "(请使用小写字母开头的参数)"
          )}`;
        }

        if (!isFirstUpperCase(input) && isFirstUpperCase(name)) {
          return `Please upper case param.${colorSubText(
            "(请使用大写字母开头的参数)"
          )}`;
        }

        return true;
      },
      default: defaultVal ?? undefined,
    }))
  );

  const namesWithVal = names.map((item) => ({
    ...item,
    val: params[item.name],
  }));

  const result = {};

  namesWithVal.forEach((item) => {
    result[item.name] = item.val;
    if (item.hasTwo) {
      result[toFirstUpperCase(item.name)] = toFirstUpperCase(item.val);
    }
  });

  return result;
};

export const getTpl = async (path: string) => {
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
  const filterSlots = [...new Set(slots)].map((item) => {
    const [name, defaultVal] = item.split(":");

    const isFirstUpperCaseName = isFirstUpperCase(name);

    return {
      name,
      defaultVal,
      isFirstUpperCaseName,
    };
  });

  const slotsMap = new Map<string, NameType>([]);

  filterSlots.forEach((item) => {
    if (
      (isFirstUpperCase(item.name) &&
        slotsMap.has(toFirstLowerCase(item.name))) ||
      (!isFirstUpperCase(item.name) &&
        slotsMap.has(toFirstUpperCase(item.name)))
    ) {
      slotsMap.delete(item.name);
      slotsMap.set(toFirstLowerCase(item.name), {
        name: toFirstLowerCase(item.name),
        defaultVal: item.defaultVal,
        hasTwo: true,
      });
    } else {
      slotsMap.set(item.name, {
        name: item.name,
        defaultVal: item.defaultVal,
      });
    }
  });

  const validSlots = await editTemplate([...slotsMap.values()]);

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

export const saveFile = (filename: string, output: string) => {
  fs.writeFileSync(`${__curDir}/${filename}`, output);
};

const isFirstUpperCase = (str: string) => {
  const pattern = /^[A-Z]/;
  return pattern.test(str);
};

const toFirstUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const toFirstLowerCase = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};
