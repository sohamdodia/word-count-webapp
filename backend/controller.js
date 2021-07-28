const express = require("express");

const schema = require("./schema");

const { getRedisKey, setRedisKey } = require("./redis");
const { extractPageText, wordCountWorker } = require("./utils");

const router = express.Router();

const fetchDataFromUrl = async ({ url, sortBy, sortOrder }) => {
  /**
   * Here response has been cached with sortBy and sortOrder parameter
   * Which can be replaced by just storing the response first and then applying sortyBy and sortOrder
   */
  const key = `${url}_${sortBy}_${sortOrder}`;

  let result = await getRedisKey({ key });

  if (!result) {
    result = await wordCountWorker({
      str: await extractPageText({ url }),
      sortBy,
      sortOrder,
    });

    await setRedisKey({
      data: JSON.stringify(result),
      key,
    });
  } else {
    result = JSON.parse(result);
  }
  return result;
};

router.post("/word-count", async (req, res) => {
  try {
    const json = {
      ...req.body,
      ...req.query,
    };
    const { error } = schema.URLSchema.validate(json);
    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }
    res.status(200).send({
      status: true,
      data: await fetchDataFromUrl(json),
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      error: error.message || "Something went wrong!",
    });
  }
});

module.exports = {
  router,
};
