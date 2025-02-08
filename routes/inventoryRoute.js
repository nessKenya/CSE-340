// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validator = require("../utilities/inventory-validation")


// Route to manage inventory
router.get("/", utilities.isAdmin, utilities.handleErrors(invController.viewInventoryManagement))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to view specific inventory item detail
router.get("/detail/:invId", utilities.handleErrors(invController.viewSpecificInvItemDetail))

// Route to add new classification
router.get("/add-classification", utilities.isAdmin, utilities.handleErrors(invController.viewAddClassification))

// Route to add new inventory form
router.get("/add-inventory", utilities.isAdmin, utilities.handleErrors(invController.viewAddInventory))

// Route to get inventory by classification id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to edit specific inventory item
router.get("/edit/:inventoryId", utilities.isAdmin, utilities.handleErrors(invController.viewEditInventory))

router.get("/delete/:inv_id", utilities.isAdmin, utilities.handleErrors(invController.viewDeleteInventory))

// Route to submit new classification data
router.post(
  "/add/classification",
  utilities.isAdmin,
  validator.classificationRule(),
  validator.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to post new inventory
router.post(
  "/add/inventory", 
  utilities.isAdmin,
  validator.inventoryRules(),
  validator.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.post(
  "/update/",
  utilities.isAdmin,
  validator.inventoryRules(),
  validator.checkUpdateData,
  invController.updateInventory
)

// Route to delete a specified vehicle
router.post("/delete", utilities.isAdmin, utilities.handleErrors(invController.deleteInventory))

module.exports = router;