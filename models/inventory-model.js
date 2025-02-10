const pool = require("../database/")

/* **
* Get all classification data
*/
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* **
* Get specific classification
*/
async function checkExistingClassification(classification_id){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_id = $1"
    const classification = await pool.query(sql, [classification_id])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* *
 *  Get all inventory items and classification_name by classification_id
 * ** */
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

/* *
 *  Get all inventory items and classification_name by classification_id
 * ** */
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

/* **
* Add new classification
*/
async function addNewClassification(classificationName) {
  try {
    const data = await pool.query(`INSERT INTO public.classification (classification_name) VALUES ($1)`, [classificationName])
    return data;
  } catch (error) {
    console.error("addNewClassification error" + error)
  }
}

/* **
* Add new classification
*/
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

/* *
 *  Update Inventory Data
 * ** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *
 *  Delete Inventory Item
 * ** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql ='DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete inventory error: " + error)
  }
}

/* *
 *  Get Comments For a Vehicle Item
 * ** */
async function getComments(inv_id) {
  try {
    const sql = `SELECT 
                    c.comment_id AS comment_id,
                    c.comment_text AS comment_text,
                    c.rating AS comment_rating,
                    c.timestamp,
                    i.inv_id AS inventory_id,
                    a.account_id AS account_id,
                    a.account_firstname AS firstname,
                    a.account_lastname AS lastname,
                    AVG(c.rating) OVER (PARTITION BY c.vehicle_id) AS average_rating
                FROM comment c
                JOIN inventory i ON c.vehicle_id = i.inv_id
                JOIN account a ON c.commentator_id = a.account_id
                WHERE c.vehicle_id = $1;`
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("Get comments error: " + error)
  }
}

// add new comment
async function addComment(rating, comment_text, vehicle_id, commentator_id) {
  try {
    const data = await pool.query(`INSERT INTO public.comment (
      rating, comment_text, vehicle_id, commentator_id
      ) VALUES ($1, $2, $3, $4)`, [rating, comment_text, vehicle_id, commentator_id])
    return data;
  } catch (error) {
    console.error("addNewComment error" + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addNewClassification, addNewVehicle, checkExistingClassification, updateInventory, deleteInventoryItem, getComments, addComment};