const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

validate.classificationRule = () => {
  return [
    body("classification_name")
    .trim()
    .escape()
    .notEmpty().withMessage('Classification name required.')
    .matches(/^[A-Za-z0-9]+$/).withMessage('Classification name should have no spaces or special characters')
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const {classification_name} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: 'Add New Classification',
      nav,
      classification_name,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make")
    .trim()
    .escape()
    .notEmpty().withMessage('Make required.')
    .isLength({ min: 3 }).withMessage('Make must be 3 characters or more')
    .matches(/^[A-Za-z0-9]+$/).withMessage('Make should have no spaces or special characters'),
    body("inv_model")
    .trim()
    .escape()
    .notEmpty().withMessage('Model required.')
    .isLength({ min: 3 }).withMessage('Model must be 3 characters or more')
    .matches(/^[A-Za-z0-9]+$/).withMessage('Model should have no spaces or special characters'),
    body("inv_year")
    .trim()
    .escape()
    .notEmpty().withMessage('Year required.')
    .matches(/^\d+$/).withMessage('Year should be a number.'),
    body("inv_description")
    .trim()
    .escape()
    .notEmpty().withMessage('Description required.'),
    body("inv_price")
    .trim()
    .escape()
    .notEmpty().withMessage('Price required.')
    .matches(/^\d+$/).withMessage('Price should be a number.'),
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty().withMessage('Miles required.')
    .matches(/^\d+$/).withMessage('Miles should be a number.'),
    body("inv_image")
    .trim()
    .escape()
    .notEmpty().withMessage('Image required.'),
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty().withMessage('Thumbnail required.'),
    body("inv_color")
    .trim()
    .escape()
    .notEmpty().withMessage('Color required.')
    .matches(/^[A-Za-z]+$/).withMessage('Invalid color.'),
    body("classification_id")
    .trim()
    .escape()
    .notEmpty().withMessage('Classification required.')
    .matches(/^\d+$/).withMessage('Invalid classification.')
    .custom(async (classification_id) => {
              const classificationExists = await inventoryModel.checkExistingClassification(classification_id)
              if (!classificationExists){
                throw new Error("Classification does not exist. Please select a valid classification.")
              }
            })
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color
  } = req.body
  let classificationDropDown = await utilities.buildClassificationList()
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: 'Add New Vehicle',
      nav,
      classificationDropDown,
      inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color
  } = req.body
  let classificationDropDown = await utilities.buildClassificationList()
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: 'Add New Vehicle',
      nav,
      classificationDropDown,
      inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color
    })
    return
  }
  next()
}

validate.commentRules = () => {
  return [
    body("comment_text")
    .trim()
    .escape()
    .notEmpty().withMessage('Comment required.'),
    body("rating")
    .trim()
    .escape()
    .notEmpty().withMessage('Rating required.')
    .matches(/^\d+$/).withMessage('Rating should be a number.')
    .isInt({max: 5, min: 1}).withMessage('Rating should be minimum 1 and maximum 5')
  ]
}

validate.checkCommmentData = async (req, res, next) => {
  const inv_id = parseInt(req.body.vehicle_id)
  let nav = await utilities.getNav()
  const inventory = await inventoryModel.getInventoryById(inv_id)
  const title = `${inventory.inv_make} ${inventory.inv_model} ${inventory.inv_year}`
  const vehicleBanner = inventory.inv_image
  const comments = await inventoryModel.getComments(inv_id)
  let averageRating = 0
  if(comments.length > 0) {
    averageRating = parseFloat(comments[0].average_rating).toFixed(1)
  }
  const {
    rating, comment_text
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/comments", {
      nav,
      errors,
      title,
      vehicleBanner,
      averageRating,
      comments,
      vehicle_id: inventory.inv_id,
      rating,
      comment_text
    })
    return
  }
  next()
}

module.exports = validate