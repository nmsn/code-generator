import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mustache from "mustache";
import { getTemplateName, selectTemplate } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* --- mustache --- */

const AP3 = path.join(__dirname, "template");
const RP3 = "./template";

const asyncImport2 = async (filename = "template.js", template) => {
  // const { default: getTemplate } = await import(`${RP3}/${template}`);
  const tpl = fs.readFileSync(`${AP3}/${template}`, "utf-8");
  console.log(tpl);

  const paramArr = tpl.match(/(?<=\{\{\{)(\S+?)(?=\}\}\})/gm);

  const validParams = [...new Set(paramArr)];

  const output = mustache.render(tpl, { name: "a" });

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
