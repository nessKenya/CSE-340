const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.errorTest = async function(req, res) {
  const error = new Error('something went terribly wrong!')
  error.status = 500
  throw error;
}

module.exports = baseController