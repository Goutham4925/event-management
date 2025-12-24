import fs from "fs";
import path from "path";
import util from "util";

function listFilesRecursive(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file === "node_modules") continue;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      listFilesRecursive(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }

  return fileList;
}

const root = "./";
const allFiles = listFilesRecursive(root);

console.log(
  util.inspect(allFiles, {
    maxArrayLength: null, // 🔥 disables trailing
    breakLength: Infinity
  })
);
