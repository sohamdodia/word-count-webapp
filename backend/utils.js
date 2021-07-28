const puppeteer = require("puppeteer");
const { Worker } = require("worker_threads");

/**
 * Extract page text via innerText property
 */
const extractPageText = async ({ url }) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();
  return data;
};

const wordCountWorker = ({ str, sortBy, sortOrder }) => {
  return new Promise((resolve, reject) => {
    /**
     * Here thread count is 1, which can be easily changed to number of cores
     * If we changes the count, we also need to change the input we're passing to wordCount.js in for loop
     * Example:
     * if thread count is 2, then split string into two parts and then pass it as input
     * original string: 'abc xyz abc pqr'
     * partOne: 'abc xyz'
     * partTwo: 'abx pqr'
     *
     */
    const threadCount = 1;
    const threads = new Set();
    const tempArr = [];
    const json = {};
    for (let i = 0; i < threadCount; i++) {
      threads.add(new Worker("./wordCount.js", { workerData: { str } }));
    }
    for (let worker of threads) {
      worker.on("error", (err) => {
        reject(err);
      });
      worker.on("exit", () => {
        threads.delete(worker);
        console.log(`Thread exiting, ${threads.size} running...`);
        if (threads.size === 0) {
          tempArr.forEach((item) => {
            Object.keys(item).forEach((key) => {
              if (!json[key]) {
                json[key] = 0;
              }
              json[key] += item[key];
            });
          });

          //convert json to array for sorting
          let list = Object.keys(json).map((word) => {
            return {
              word,
              count: json[word],
            };
          });

          let sorter = SORTERS[sortBy];

          if (sorter) {
            sorter = sorter[sortOrder];
          }

          if (sorter) {
            list = sorter(list);
          }
          resolve(list);
        }
      });
      worker.on("message", (res) => {
        tempArr.push(res.data);
      });
    }
  });
};

const SORTERS = {
  word: {
    asc: (list) => {
      return list.sort((a, b) => {
        if (a.word < b.word) {
          return -1;
        } else if (a.word > b.word) {
          return 1;
        }

        return 0;
      });
    },

    desc: (list) => {
      return list.sort((a, b) => {
        if (a.word < b.word) {
          return 1;
        } else if (a.word > b.word) {
          return -1;
        }

        return 0;
      });
    },
  },

  count: {
    asc: (list) => {
      return list.sort((a, b) => {
        if (a.count < b.count) {
          return -1;
        } else if (a.count > b.count) {
          return 1;
        }

        return 0;
      });
    },

    desc: (list) => {
      return list.sort((a, b) => {
        if (a.count < b.count) {
          return 1;
        } else if (a.count > b.count) {
          return -1;
        }

        return 0;
      });
    },
  },
};

const wordCount = (string) => {
  const words = string.split(/[\W]/g);
  const freqMap = {};
  words.forEach((word) => {
    word = word.toLowerCase().trim();
    if (word) {
      if (!freqMap[word]) {
        freqMap[word] = 0;
      }
      freqMap[word] += 1;
    }
  });
  return freqMap;
};

module.exports = {
  extractPageText,
  wordCountWorker,
  SORTERS,
  wordCount,
};
