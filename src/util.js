export const removeMultipleStrLeadingSpace = (
  strTemplate,
  keepBlankRow = true
) => {
  if (!strTemplate) {
    return "";
  }
  if (keepBlankRow) {
    return strTemplate.replace(/^[^\S\n]+/gm, "");
  }
  return strTemplate.replace(/^\s+/gm, "");
};

export const getTemplateName = async (path) => {
  const files = fs.readdirSync(path);
  return files;
};

export const selectTemplate = async (fileNames) => {
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
