const axios = require("axios");
const cheerio = require("cheerio");
//sc-1eb5slv-0 iworPT - name
// sc-131di3y-0 cLgOOr - price
const URL = "https://coinmarketcap.com/";
const selector =
  "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr";
module.exports = {
  async getAll(req, res) {
    const response = await axios.get(URL);
    const html = response.data;
    const $ = cheerio.load(html);
    const cryptoCurrencies = [];
    const keys = [
      "Rank",
      "Name",
      "Price",
      "24hr Change",
      "7d Change",
      "Market Cap",
      "Volume",
      "Circulating Supply",
    ];

    $(selector).each(function (parentIndex, parentEl) {
      let keyIndex = 0;
      const coinObj = {};

      if (parentIndex < 10) {
        $(parentEl)
          .children()
          .each((childIndex, childEl) => {
            const tableDataValue = $(childEl).text();
            if (tableDataValue) {
              coinObj[keys[keyIndex++]] = tableDataValue;
            }
          });
        cryptoCurrencies.push(coinObj);
      }
    });
    res.json({ cryptoCurrencies });
  },
};
