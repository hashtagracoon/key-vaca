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
        cambridgeTestResult.push(false);
        cambridgeTestLog.push(resArr);
      }
      else {
        cambridgeTestResult.push(true);
        cambridgeTestLog.push(null);
      }
      resolve();
    })
    .catch((err) => {
      //console.log(err);
      cambridgeTestResult.push(false);
      cambridgeTestLog.push(err);
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
        wikipediaTestResult.push(false);
        wikipediaTestLog.push(resStr);
      }
      else {
        wikipediaTestResult.push(true);
        wikipediaTestLog.push(null);
      }
      resolve();
    })
    .catch((err) => {
      //console.log(err);
      wikipediaTestResult.push(false);
      wikipediaTestLog.push(err);
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
        imageTestResult.push(false);
        imageTestLog.push(resArr);
      }
      else {
        imageTestResult.push(true);
        imageTestLog.push(null);
      }
      resolve();
    })
    .catch((err) => {
      //console.log(err);
      imageTestResult.push(false);
      imageTestLog.push(err);
      resolve();
    });
  });
};

async function asyncRunTest() {
  await Promise.all(cambridgeTestSuite.map(cambridgeRunner));
  await Promise.all(wikipediaTestSuite.map(wikipediaRunner));
  await Promise.all(imageTestSuite.map(imageRunner));
  console.log("finish");
}

asyncRunTest();
