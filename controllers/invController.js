const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***
 *  Build inventory by classification view
 * **** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.viewSpecificInvItemDetail = async function(req, res, next) {
  const inv_id  = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  let nav = await utilities.getNav()
  const template = await utilities.createSpecificInventoryDetailsTemplate(data)
  res.render("./inventory/details", {
    title: data.inv_make,
    nav,
    template,
  })
}

invCont.viewInventoryManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: 'Inventory Management',
    nav,
    message: null
  })
}

invCont.viewAddClassification = async function(req, res,next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: 'Add New Classification',
    nav,
    errors: null
  })
}

invCont.addClassification = async function(req, res, next) {
  let message
  const {classification_name} = req.body;
  const data = await invModel.addNewClassification(classification_name)
  let nav = await utilities.getNav()
  if(data) {
    message = `${classification_name} classification was added successfully`
  } else {
    message = null
  }
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
    message
  })
}

invCont.viewAddInventory = async function(req, res,next) {
  let nav = await utilities.getNav()
  let classificationDropDown = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: 'Add New Classification',
    nav,
    errors: null,
    classificationDropDown,
  })
}

invCont.addInventory = async function(req, res, next) {
  let message
  const {
    inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color
  } = req.body
  const data = await invModel.addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color)
  let nav = await utilities.getNav()
  if(data) {
    message = `${inv_make} ${inv_model} was added successfully`
  } else {
    message = null
  }
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
    message,
    errors: null,
  })
}
module.exports = invCont