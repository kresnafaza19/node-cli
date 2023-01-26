#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const Fs = require("@supercharge/fs");
const fileType = ["json", "text"];
const defOutputDir = __dirname + "/output";

let argv = yargs.usage(`
Usage : $0 [Path To File] [options]

[Path To File] must be complete path from root dir 
example :
/var/log/syslog
/home/faza/project/node-cli/syslog
`).options({
  t: {
    alias: "transform",
    choices: fileType,
    default: "text",
    describe: "Transform file to JSON/PlainText",
  },
  o: {
    alias: "output",
    demandOption: false,
    default: defOutputDir,
    describe: "Output directory file",
    type: "string",
  },
}).version(`
====================================================================
=        ====================================     ===  ========    =
=  =========================================  ===  ==  =========  ==
=  ========================================  ========  =========  ==
=  =========   ===      ===   =============  ========  =========  ==
=      ====  =  ======  ==  =  ==        ==  ========  =========  ==
=  ===========  =====  ======  ============  ========  =========  ==
=  =========    ====  =====    ============  ========  =========  ==
=  ========  =  ===  =====  =  =============  ===  ==  =========  ==
=  =========    ==      ===    ==============     ===        ==    =
====================================================================

version : 1.0.0
`).argv;

if (argv.h) {
  yargs.showHelp();
} else if (argv.v) {
  yargs.showVersion();
} else if (argv._.length > 1) {
  console.log("Too many arguments, 1 expected", argv._.length, "given");
} else if (argv._.length < 1) {
  console.log("Too few arguments, 1 expected", argv._.length, "given");
} else {
  // process file
  try {
    const data = fs.readFileSync(argv._[0], "utf8");
    const outputName = getAndValidateFilename(argv);
    if (argv.t === "text") {
      writePlainTextFile(outputName, data);
    } else if (argv.t === "json") {
      writeJsonFile(outputName, data);
    }
  } catch (err) {
    console.error(err.message);
  }
}

function writePlainTextFile(filename, content) {
  try {
    fs.writeFileSync(filename, content);
    console.log("Successfully write file in :", filename);
  } catch (err) {
    console.error(err);
  }
}

function writeJsonFile(filename, content) {
  try {
    let arrContent = content.split("\n");
    let retArr = [];
    for (let i = 0; i < arrContent.length; i++) {
      if (arrContent[i] == "") continue;
      let keyContent = arrContent[i].substring(0, arrContent[i].indexOf(": "));
      let valueContent = arrContent[i].substring(
        arrContent[i].indexOf(": ") + 1
      );
      let tempObj = {};
      tempObj[keyContent] = valueContent;
      retArr.push(tempObj);
    }
    fs.writeFileSync(filename, JSON.stringify(retArr));
    console.log("Successfully write file in :", filename);
  } catch (err) {
    console.error(err);
  }
}

function getAndValidateFilename(argv) {
  // if default output
  let outputName;

  if (argv.o === defOutputDir) {
    let filename = Fs.filename(argv._[0]);
    argv.t === "text"
      ? (outputName = defOutputDir + `/${filename}.txt`)
      : (outputName = defOutputDir + `/${filename}.json`);
  } else {
    if (argv.t === "text") {
      let ext = Fs.extension(argv.o);
      // if transform and extension not match, then force it
      if (ext !== ".txt") {
        console.log(
          "File extension do not match, forced to use .txt extension"
        );
        let tempPath = Fs.dirname(argv.o);
        let filename = Fs.filename(argv._[0]);
        outputName = tempPath + `/${filename}.txt`;
      } else {
        outputName = argv.o;
      }
    }
    if (argv.t === "json") {
      let ext = Fs.extension(argv.o);
      // if transform and extension not match, then force it
      if (ext !== ".json") {
        console.log(
          "File extension do not match, forced to use .json extension"
        );
        let tempPath = Fs.dirname(argv.o);
        let filename = Fs.filename(argv._[0]);
        outputName = tempPath + `/${filename}.json`;
      } else {
        outputName = argv.o;
      }
    }
  }

  return outputName;
}
