const pool = require("../database/")

/* ****
* Get all classification data
*****/
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ****
* Get specific classification
*****/
async function checkExistingClassification(classification_id){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_id = $1"
    const classification = await pool.query(sql, [classification_id])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***
 *  Get all inventory items and classification_name by classification_id
 * **** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***
 *  Get all inventory items and classification_name by classification_id
 * **** */
async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM PUBLIC.inventory WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0];
  } catch (error) {
    console.error("getinventorybyid error" + error)
  }
}

/* ****
* Add new classification
*****/
async function addNewClassification(classificationName) {
  try {
    const data = await pool.query(`INSERT INTO public.classification (classification_name) VALUES ($1)`, [classificationName])
    return data;
  } catch (error) {
    console.error("addNewClassification error" + error)
  }
}

/* ****
* Add new classification
*****/
async function addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color) {
  try {
    const data = await pool.query(`INSERT INTO public.inventory (
      inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)`, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_thumbnail, inv_image, classification_id, inv_miles, inv_color])
    return data;
  } catch (error) {
    console.error("addNewInventory error" + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addNewClassification, addNewVehicle, checkExistingClassification};