const express = require("express");
const router = express.Router();
const { updateUserCoordinates, getUserCoordinates } = require("../controllers/map.controller");
const protect = require("../middlewares/auth.middleware"); // Adjust path to your middleware file

router.use(protect);

router.put("/address", updateUserCoordinates);

router.get("/location", getUserCoordinates);

module.exports = router;
