//Require Statements
const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****
 * Constructs the nav HTML unordered list
 **** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ******
* Build the classification view HTML
* **** */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt=" '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +'" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ******
* Build the specific inventory view Template
* **** */
Util.createSpecificInventoryDetailsTemplate = async function(data) {
  let template = `
    <div id="details-container">
      <div id="image-container" class="col">
        <img src="${data.inv_image}" alt="${data.inv_make} - ${data.inv_model} picture" id="main-img"/>
      </div>

      <div id="info-card" class="col">
        <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}, ${data.inv_color}</h2>
        <div id="price-banner">
          <div id="section-mileage" class="col">
            <span id="mileage-tag">MILEAGE</span><br/>
            <b>${Intl.NumberFormat().format(data.inv_miles)}</b>
          </div>

          <h3 class="col-2">No-Haggle Price</h3>

          <div class="col">
          <h3>${Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(data.inv_price)}</h3>
          <p>Does not include taxes.</p>
          <p>ESTIMATE PAYMENTS</p>
          </div>
        </div>
        <p><b>Make:</b> ${data.inv_make}</p>
        <p><b>Model:</b> ${data.inv_model}</p>
        <p><b>Color:</b> ${data.inv_color}</p>
        <p><b>Mileage:</b> ${data.inv_miles}</p>
        <p><b>Description:</b><br>${data.inv_description}</p>
      </div>
    </div>
  `
  return template;
}

/* ******
* Classification list dropdown.
* **** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList">'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("warningDetails", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ******
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 ****** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util