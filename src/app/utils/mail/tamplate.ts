/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export const renderTemplate = (
  templateName: string,
  data: Record<string, any>,
) => {
  const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);

  const source = fs.readFileSync(filePath, "utf-8");
  const template = Handlebars.compile(source);

  return template(data);
};
