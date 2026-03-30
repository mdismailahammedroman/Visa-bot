/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export const renderTemplate = (
  templateName: string,
  data: Record<string, any>,
) => {
  let filePath = path.join(__dirname, "templates", `${templateName}.hbs`);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(
      process.cwd(),
      "src",
      "app",
      "utils",
      "mail",
      "templates",
      `${templateName}.hbs`,
    );
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Template not found: ${filePath}`);
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const template = Handlebars.compile(source);
  return template(data);
};
