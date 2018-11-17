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
  //else if(!resArr[0].gram) return false;
  else if(resArr[0].meanings.length === 0) return false;
  return true;
};

const checkWebsterSearchResult = (resArr) => {
  if(!resArr) return false;
  else if(resArr.length === 0) return false;
  else if(!resArr[0].title) return false;
  else if(!resArr[0].pron) return false;
  else if(!resArr[0].mp3) return false;
  else if(!resArr[0].pos) return false;
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
const websterTestSuite = ["abed", "abidance", "crustaceous", "preemption", "resistless", "wherewith"];
const wikipediaTestSuite = ["Metallica"];
const imageTestSuite = ["raccoon"];

let cambridgeTestResult = [];
let websterTestResult = [];
let wikipediaTestResult = [];
let imageTestResult = [];

const cambridgeRunner = (elem) => {
  return new Promise((resolve, reject) => {
    searcher.searchCambridge(elem)
    .then((resArr) => {
      if(!checkCambridgeSearchResult(resArr)) {
        cambridgeTestResult.push({
          target: elem,
          result: "failed",
          log: resArr
        });
      }
      else {
        cambridgeTestResult.push({
          target: elem,
          result: "pass"
        });
      }
      resolve();
    })
    .catch((err) => {
      cambridgeTestResult.push({
        target: elem,
        result: "failed",
        log: err
      });
      resolve();
    });
  });
};

const websterRunner = (elem) => {
  return new Promise((resolve, reject) => {
    searcher.searchWebster(elem)
    .then((resArr) => {
      if(!checkWebsterSearchResult(resArr)) {
        websterTestResult.push({
          target: elem,
          result: "failed",
          log: resArr
        });
      }
      else {
        websterTestResult.push({
          target: elem,
          result: "pass"
        });
      }
      resolve();
    })
    .catch((err) => {
      websterTestResult.push({
        target: elem,
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
      if(!checkWikipediaSearchResult(resStr)) {
        wikipediaTestResult.push({
          target: elem,
          result: "failed",
          log: resStr
        });
      }
      else {
        wikipediaTestResult.push({
          target: elem,
          result: "pass"
        });
      }
      resolve();
    })
    .catch((err) => {
      wikipediaTestResult.push({
        target: elem,
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
      if(!checkImageSearchResult(resArr)) {
        imageTestResult.push({
          target: elem,
          result: "failed",
          log: resArr
        });
      }
      else {
        imageTestResult.push({
          target: elem,
          result: "pass"
        });
      }
      resolve();
    })
    .catch((err) => {
      imageTestResult.push({
        target: elem,
        result: "failed",
        log: err
      });
      resolve();
    });
  });
};

async function asyncRunTest() {

  await Promise.all(cambridgeTestSuite.map(cambridgeRunner));
  await Promise.all(websterTestSuite.map(websterRunner));
  await Promise.all(wikipediaTestSuite.map(wikipediaRunner));
  await Promise.all(imageTestSuite.map(imageRunner));
  console.log("test finish");

  let overallTestResult = "PASS";
  let testDetails = "";
  cambridgeTestResult.map((elem) => {
    testDetails += `${elem.target}: ${elem.result}\n`;
    if(elem.result !== "pass") {
      overallTestResult = "FAILED";
      testDetails += JSON.stringify(elem.log) + "\n";
    }
  });
  websterTestResult.map((elem) => {
    testDetails += `${elem.target}: ${elem.result}\n`;
    if(elem.result !== "pass") {
      overallTestResult = "FAILED";
      testDetails += JSON.stringify(elem.log) + "\n";
    }
  });
  wikipediaTestResult.map((elem) => {
    testDetails += `${elem.target}: ${elem.result}\n`;
    if(elem.result !== "pass") {
      overallTestResult = "FAILED";
      testDetails += JSON.stringify(elem.log) + "\n";
    }
  });
  imageTestResult.map((elem) => {
    testDetails += `${elem.target}: ${elem.result}\n`;
    if(elem.result !== "pass") {
      overallTestResult = "FAILED";
      testDetails += JSON.stringify(elem.log) + "\n";
    }
  });

  console.log("overallTestResult = " + overallTestResult);

  console.log("testDetails = " + testDetails);

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
    subject: `[${overallTestResult}] eastern auto-test result`,
    text: testDetails
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  });

}

asyncRunTest();
