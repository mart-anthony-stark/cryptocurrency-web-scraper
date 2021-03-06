const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  async getTopCoins(req, res) {
    const URL = "https://coinmarketcap.com/";
    const selector =
      "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr";
    const response = await axios.get(URL);
    const html = response.data;
    const $ = cheerio.load(html);
    const cryptoCurrencies = [];
    const keys = [
      "Rank",
      "Name",
      "Price",
      "24hr Change Rate",
      "7d Change Rate",
      "Market Cap",
      "Volume(24hr)",
      "Circulating Supply",
      "Last 7 days",
    ];

    $(selector).each(function (parentIndex, parentEl) {
      let keyIndex = 0;
      const coinObj = {};
      let acronym;

      if (parentIndex < 10) {
        $(parentEl)
          .children()
          .each((childIndex, childEl) => {
            let tableDataValue = $(childEl).text();
            if (keyIndex === 1) {
              tableDataValue = $(childEl).find(".sc-1eb5slv-0.iworPT").text();
              acronym = $(childEl)
                .find(".sc-1eb5slv-0.gGIpIK.coin-item-symbol")
                .text();
            }
            if (keyIndex === 8) {
              tableDataValue = $(childEl).find(".h7vnx2-0.bCltOL").attr("src");
            }

            if (tableDataValue) {
              coinObj[keys[keyIndex++]] = tableDataValue;
            }
          });
        coinObj["Coin Symbol"] = acronym;
        cryptoCurrencies.push(coinObj);
      }
    });
    res.json({ website: URL, cryptoCurrencies });
  },

  async getNews(req, res) {
    const URL =
      "https://www.investing.com/news/cryptocurrency-news?utm_source=google&utm_medium=cpc&utm_campaign=14712539458&utm_content=546922691691&utm_term=dsa-42114402488_&GL_Ad_ID=546922691691&GL_Campaign_ID=14712539458&gclid=CjwKCAiAzrWOBhBjEiwAq85QZ5Ur6faaX4PoxOo8E-GLFt5126iJjPPYTPL0kxmObd1s78P6xre93hoCDzUQAvD_BwE";
    const selector = "#leftColumn > div.largeTitle > article > div.textDiv";
    const response = await axios.get(URL);
    const html = response.data;
    const $ = cheerio.load(html);
    const news = [];

    const keys = ["heading", "author", "desc"];

    $(selector).each((parentIndex, parentEl) => {
      const articleObj = {};
      let keyIndex = 0;
      let link;
      $(parentEl)
        .children()
        .each((childIndex, childEl) => {
          const article = $(childEl).text();
          link = $(childEl).attr("href");
          articleObj[keys[keyIndex++]] = article;
          if (link) articleObj.link = link;
        });
      news.push(articleObj);
    });

    res.send({ baseLink: URL, news });
  },
};
