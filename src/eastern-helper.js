const searcher = require("./api/SearchWrapper");

searcher.searchCambridge("address")
.then((resArr) => {
  console.log(resArr);
})
.catch((err) => {
  console.log(err);
});

searcher.searchWikipedia("Metallica")
.then((resStr) => {
  console.log(resStr);
})
.catch((err) => {
  console.log(err);
});

searcher.searchImage("raccoon")
.then((resArr) => {
  console.log(resArr);
})
.catch((err) => {
  console.log(err);
});
