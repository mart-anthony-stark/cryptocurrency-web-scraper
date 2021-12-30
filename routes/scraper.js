const router = require("express").Router();
const { getAll } = require("../controllers/scraper");

router.get("/", getAll);
module.exports = router;
