import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mustache from 'mustache';
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

const AP3 = path.join(__dirname, "template");
const RP3 = "./template";

const asyncImport2 = async (filename = "template.js", template) => {
  // const { default: getTemplate } = await import(`${RP3}/${template}`);
  const tpl = fs.readFileSync(`${AP3}/${template}`, "utf-8");
  console.log(tpl);
  
  const paramArr = tpl.match(/(?<=\{\{\{)(\S+?)(?=\}\}\})/gm);
  
  const validParams = [...new Set(paramArr)];
  
  const output = mustache.render(tpl, { name: 'a' });
  
  console.log(output, validParams);

  // fs.writeFileSync(
  //   `./${filename}`,
  //   removeMultipleStrLeadingSpace(getTemplate())
  // );
};

const cli3 = async () => {
  const files = await getTemplateName(AP3);
  const { template } = await selectTemplate(files);
  asyncImport2(undefined, template);
};

cli3();
