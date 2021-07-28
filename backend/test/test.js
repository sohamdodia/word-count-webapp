const { expect } = require("chai");
const { wordCount } = require("../utils");

const seedData = {
  str: "abc, 123. ef733 !~  xyz 123 abc xy [123]",
};

describe("Word Count", () => {
  it("should return proper word count for 'abc'", () => {
    const result = wordCount(seedData.str);
    expect(result.abc).to.equal(2);
  });
  it("should return proper word count for '123'", () => {
    const result = wordCount(seedData.str);
    expect(result["123"]).to.equal(3);
  });
});
