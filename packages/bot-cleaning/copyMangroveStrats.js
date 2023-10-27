const fse = require("fs-extra");

const srcDirs = [
  {
    src: "../../node_modules/@mangrovedao/mangrove-core/",
    dest: "./mangrove-src/core",
  },
  {
    src: "../../node_modules/@mangrovedao/mangrove-strats/",
    dest: "./mangrove-src/strats",
  },
];

// To copy a folder or file, select overwrite accordingly
try {
  for (dir of srcDirs) {
    fse.copySync(dir.src, dir.dest, { overwrite: true });
  }
  console.log("success!");
} catch (err) {
  console.error(err);
}
