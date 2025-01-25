const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* *********
 *  Build inventory by classification view
 * ********** */
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

module.exports = invCont