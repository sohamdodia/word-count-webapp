const Joi = require("joi");
const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$/;

const URLSchema = Joi.object({
  url: Joi.string().required().regex(urlRegex, "http://xyz.com").label("url"),
  sortBy: Joi.string().required().valid("word", "count"),
  sortOrder: Joi.string().required().valid("asc", "desc"),
});

module.exports = {
  URLSchema,
};
