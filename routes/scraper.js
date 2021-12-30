const router = require("express").Router();
const { getTopCoins, getNews } = require("../controllers/scraper");

router.get("/", getTopCoins);
router.get("/news", getNews);
module.exports = router;
