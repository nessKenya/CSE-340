const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")


/*  ****
*  Registration Data Validation Rules
* ***** */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty().withMessage('First name is empty.')
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 3 }).withMessage('Last name must be 2 characters or more'), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email.")
        }
      }),
  
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty().withMessage('Password is required.')
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ****
* Check data and return errors or continue to registration
* ***** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  ****
*  Login Data Validation Rules
* ***** */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
          throw new Error("Email not found. Please register or use another registered email")
        }
      }),
  
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty().withMessage('password is required')
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Invalid password."),
  ]
}

  /* ****
* Check data and return errors or continue to login
* ***** */
validate.checkLoginData = async (req, res, next) => {
const { account_email, account_password } = req.body
let errors = []
errors = validationResult(req)
if (!errors.isEmpty()) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    errors,
    title: "Login",
    nav,
    account_email,
  })
  return
}
next()
}

/*  ****
*  Account Update Data Validation Rules
* ***** */
validate.accountUpdateRules = () => {
  return [
     // firstname is required and must be string
     body("account_id")
     .trim()
     .escape()
     .notEmpty(),

    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty().withMessage('First name is empty.')
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 3 }).withMessage('Last name must be 2 characters or more'), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
          throw new Error("Email does not exist. Please register or use different registered email.")
        }
      }),
  ]
}

/* ****
* Check data and return errors or continue to account credential update
* ***** */
validate.checkAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors,
      passwordErrors: null,
      title: "Update Account Credentials",
      nav,
      account_firstname, 
      account_lastname, 
      account_email, 
      account_id
    })
    return
  }
  next()
}

/*  ****
*  Password Change Validation Rules
* ***** */
validate.passwordChangeRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty().withMessage('Password is required.')
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ****
* Check data and return errors or continue to registration
* ***** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let passwordErrors = []
  passwordErrors = validationResult(req)
  if (!passwordErrors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors: null,
      passwordErrors,
      title: "Update Account Credentials",
      nav,
      account_firstname, 
      account_lastname, 
      account_email
    })
    return
  }
  next()
}

module.exports = validate