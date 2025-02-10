const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* *
 *  Build inventory by classification view
 * ** */
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: 'Inventory Management',
    nav,
    message: null,
    classificationSelect,
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
  const classificationSelect = await utilities.buildClassificationList()
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
    classificationSelect
  })
}

/* *
 *  Return Inventory by Classification As JSON
 * ** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* *
 *  Update View For Inventory Data
 * ** */
invCont.viewEditInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* *
 *  Update Inventory Data
 * ** */
invCont.updateInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* *
 *  Delete View For Inventory Data
 * ** */
invCont.viewDeleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* *
 *  Delete Inventory Data
 * ** */
invCont.deleteInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
  } = req.body
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}


/* *
 *  Comments View For Inventory
 * ** */
invCont.viewInventoryComments = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const inventory = await invModel.getInventoryById(inv_id)
  const title = `${inventory.inv_make} ${inventory.inv_model} ${inventory.inv_year}`
  const vehicleBanner = inventory.inv_image
  const comments = await invModel.getComments(inv_id)
  let averageRating = 0
  if(comments.length > 0) {
    averageRating = parseFloat(comments[0].average_rating).toFixed(1)
  }
  res.render("./inventory/comments", {
    nav,
    errors: null,
    title,
    vehicleBanner,
    averageRating,
    comments,
    vehicle_id: inventory.inv_id
  })
}


/* *
 *  Add comment
 * ** */
invCont.addNewCommment = async function(req, res, next) {
  let message
  const {
    rating, comment_text, vehicle_id, commentator_id
  } = req.body
  const data = await invModel.addComment(rating, comment_text, vehicle_id, commentator_id)
  if(data) {
    message = `Comment added was added successfully`
  } else {
    message = null
  }
  const inv_id = parseInt(vehicle_id)
  let nav = await utilities.getNav()
  const inventory = await invModel.getInventoryById(inv_id)
  const title = `${inventory.inv_make} ${inventory.inv_model} ${inventory.inv_year}`
  const vehicleBanner = inventory.inv_image
  const comments = await invModel.getComments(inv_id)
  let averageRating = 0
  if(comments.length > 0) {
    averageRating = parseFloat(comments[0].average_rating).toFixed(1)
  }
  res.render('./inventory/comments', {
    title,
    nav,
    message,
    errors: null,
    vehicleBanner,
    averageRating,
    comments,
    vehicle_id: inventory.inv_id
  })
}

module.exports = invCont