// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validator = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to view specific inventory item detail
router.get("/detail/:invId", utilities.handleErrors(invController.viewSpecificInvItemDetail))

// Route to add new classification
router.get("/add-classification", utilities.handleErrors(invController.viewAddClassification))

// Route to add new inventory form
router.get("/add-inventory", utilities.handleErrors(invController.viewAddInventory))

// Route to submit new classification data
router.post(
  "/add/classification", 
  validator.classificationRule(),
  validator.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to post new inventory
router.post(
  "/add/inventory", 
  validator.inventoryRules(),
  validator.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to manage inventory
router.get("/", utilities.handleErrors(invController.viewInventoryManagement))

module.exports = router;