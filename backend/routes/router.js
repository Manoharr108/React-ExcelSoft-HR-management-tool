const express = require("express");
const router = express();
const controller = require("../controllers/emplyoee-controller");

router.get("/employees",controller.AllEmployee);
router.get("/emp/:category",controller.Emplyoee);
router.post("/add",controller.AddEmplyoee);
router.delete("/delete/:id",controller.DeleteEmplyoee);
router.put("/edit/:id", controller.ModifyEmployee);
router.get("/employee/:id", controller.FindAnEmplyoee);
router.delete("/tab/:category",controller.DeleteTab);

module.exports = router;