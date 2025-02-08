/* *******
* Account Routes
* Deliver Login View Activity
* *******/
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/* *******
* Deliver Login View
* *******/
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* *******
* Deliver Registration View
* *******/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* *******
* Deliver Account View
* *******/
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

/* *******
* Update Account View
* *******/
router.get("/update/:acc_id", utilities.checkLogin, utilities.handleErrors(accountController.updateAccountView))

router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.logout))

/* *******
* Enable the Registration
* Process the registration data
* *******/
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* *******
* Update Account Credentials
* *******/
router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccountDetails)
)

/* *******
* Update Account Credentials
* *******/
router.post(
  "/change-password",
  regValidate.passwordChangeRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changeAccountPassword)
)

module.exports = router