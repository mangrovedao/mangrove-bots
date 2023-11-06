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
  {
    src: "../mangrove-arbitrage/",
    dest: "./mangrove-src/arbitrage",
  },
];

// To copy a folder or file, select overwrite accordingly
try {
  for (dir of srcDirs) {
    fse.removeSync(dir.dest);
    fse.copySync(dir.src, dir.dest, {
      overwrite: true,
    });
  }
  console.log("success!");
} catch (err) {
  console.error(err);
}
