const fse = require("fs-extra");

const coreDir = `../../node_modules/@mangrovedao/mangrove-core/addresses`;
const stratsDir = `../../node_modules/@mangrovedao/mangrove-strats/addresses`;
const destCoreDir = `node_modules/@mangrovedao/mangrove-core/addresses`;
const destStratsDir = `node_modules/@mangrovedao/mangrove-strats/addresses`;

// To copy a folder or file, select overwrite accordingly
try {
  fse.copySync(coreDir, destCoreDir, { overwrite: true });
  fse.copySync(stratsDir, destStratsDir, { overwrite: true });
  console.log("success!");
} catch (err) {
  console.error(err);
}
