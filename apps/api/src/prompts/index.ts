import fs from "fs";

const prompts = fs.readFileSync("./prompts/promt.md", "utf-8");

export default prompts;