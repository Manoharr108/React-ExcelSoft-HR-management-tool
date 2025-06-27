const express = require("express");
const router = express();   
const controller = require("../controllers/emplyoee-controller");
const linkscontroller = require("../controllers/quicklinks")
const remarkscontroller = require("../controllers/remarkscontroller")

router.get("/employees",controller.AllEmployee);
router.get("/achievers-employees",controller.AllAchieversEmployee);

router.get("/emp/:category/:quarter",controller.Employee);//same as below
router.get("/tab/:category/:quarter", controller.manageTab)//

router.get("/empID/:empid",controller.EmplyoeeWithId);
router.get("/employee/:empid/:category/:quarter", controller.FindAnEmplyoee);

router.get("/download/:quarter", controller.AllEmployeeWithQuarter); //this is donwload button


router.post("/add",controller.AddEmplyoee);
router.post("/addtab",controller.AddTab);

router.delete("/delete/:empid/:category/:quarter",controller.DeleteEmplyoee);
router.delete("/tab/:category/:quarter",controller.DeleteTab);

router.put("/edit/:empid/:category/:quarter", controller.ModifyEmployee);

router.put("/publish/:activeQuarter", controller.publishquarter)

//this is for quicklinks
router.get("/quicklinks", linkscontroller.GetAllQuickLinks)
router.post("/addgrouplink", linkscontroller.AddGroupLinks)
router.delete("/deletegroup", linkscontroller.deleteGroup)
router.delete("/deletelink", linkscontroller.deleteLink)
router.put("/addlink", linkscontroller.addLinkToGroup)
router.put("/editlink", linkscontroller.EditLink)

//for remarks
router.get("/getremarks/:quarter", remarkscontroller.GetRemarks)
router.post("/remarks/addoredit", remarkscontroller.AddandEditRemarks)

module.exports = router;