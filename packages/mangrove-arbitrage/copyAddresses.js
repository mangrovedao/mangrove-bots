const fse = require("fs-extra");

const srcDir = `../../node_modules/@mangrovedao/mangrove-core/addresses`;
const destDir = `node_modules/@mangrovedao/mangrove-core/addresses`;

// To copy a folder or file, select overwrite accordingly
try {
  fse.copySync(srcDir, destDir, { overwrite: true });
  console.log("success!");
} catch (err) {
  console.error(err);
}
