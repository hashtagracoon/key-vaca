const fs = require("fs");
const nodemailer = require("nodemailer");
const searcher = require("./api/SearchWrapper");

const checkCambridgeSearchResult = (resArr) => {
  if(!resArr) return false;
  else if(resArr.length === 0) return false;
  else if(!resArr[0].title) return false;
  else if(!resArr[0].pron) return false;
  else if(!resArr[0].mp3) return false;
  else if(!resArr[0].pos) return false;
  else if(!resArr[0].gram) return false;
  else if(resArr[0].meanings.length === 0) return false;
  return true;
};

const checkWikipediaSearchResult = (resStr) => {
  if(!resStr) return false;
  return true;
};

const checkImageSearchResult = (resArr) => {
  if(!resArr || resArr.length === 0) return false;
  return true;
};

const cambridgeTestSuite = ["address", "humiliate", "as", "objective", "awesome"];
const wikipediaTestSuite = ["Metallica"];
const imageTestSuite = ["raccoon"];

let cambridgeTestResult = [];
let wikipediaTestResult = [];
let imageTestResult = [];

let cambridgeTestLog = [];
let wikipediaTestLog = [];
let imageTestLog = [];

const cambridgeRunner = (elem) => {
  return new Promise((resolve, reject) => {
    searcher.searchCambridge(elem)
    .then((resArr) => {
      //console.log(resArr);
      if(!checkCambridgeSearchResult(resArr)) {
        cambridgeTestResult.push({
          result: "failed",
          log: resArr
        });
      }
      else {
        cambridgeTestResult.push({
          result: "pass"
        });
      }
      resolve();
    })
    .catch((err) => {
      //console.log(err);
      cambridgeTestResult.push({
        result: "failed",
        log: err
      });
      resolve();
    });
  });
};

const wikipediaRunner = (elem) => {
  return new Promise((resolve, reject) => {
    searcher.searchWikipedia(elem)
    .then((resStr) => {
      //console.log(resStr);
      if(!checkWikipediaSearchResult(resStr)) {
        wikipediaTestResult.push({
          result: "failed",
          log: resStr
        });
      }
      else {
        wikipediaTestResult.push({
          result: "pass"
        });
      }
      resolve();
    })
    .catch((err) => {
      //console.log(err);
      wikipediaTestResult.push({
        result: "failed",
        log: err
      });
      resolve();
    });
  });
};

const imageRunner = (elem) => {
  return new Promise((resolve, reject) => {
    searcher.searchImage(elem)
    .then((resArr) => {
      //console.log(resArr);
      if(!checkImageSearchResult(resArr)) {
        imageTestResult.push({
          result: "failed",
          log: resArr
        });
      }
      else {
        imageTestResult.push({
          result: "pass"
        });
      }
      resolve();
    })
    .catch((err) => {
      //console.log(err);
      imageTestResult.push({
        result: "failed",
        log: err
      });
      resolve();
    });
  });
};

async function asyncRunTest() {

  await Promise.all(cambridgeTestSuite.map(cambridgeRunner));
  await Promise.all(wikipediaTestSuite.map(wikipediaRunner));
  await Promise.all(imageTestSuite.map(imageRunner));
  console.log("test finish");

  let overallTestResult = "pass";
  cambridgeTestResult.map((elem) => {
    console.log(elem);
    if(elem.result !== "pass") {
      overallTestResult = "failed";
    }
  });
  wikipediaTestResult.map((elem) => {
    console.log(elem);
    if(elem.result !== "pass") {
      overallTestResult = "failed";
    }
  });
  imageTestResult.map((elem) => {
    console.log(elem);
    if(elem.result !== "pass") {
      overallTestResult = "failed";
    }
  });

  console.log("overallTestResult = " + overallTestResult);

  const readword = fs.readFileSync("readfile.txt", "utf8");
  console.log("readword = " + readword);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "roboticcoon@gmail.com",
      pass: readword
    }
  });

  const mailOptions = {
  from: "roboticcoon@gmail.com",
  to: "alichchiu@gmail.com",
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

}

asyncRunTest();
