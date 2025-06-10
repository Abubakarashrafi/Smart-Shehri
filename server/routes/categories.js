import express from "express";
import pool from "../config/database.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        d.name as department_name,
        COUNT(comp.id) as complaint_count
      FROM categories c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN complaints comp ON c.id = comp.category_id
    
      GROUP BY c.id, d.name
      ORDER BY c.name
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/by-department/:departmentId", async (req, res) => {
  try {
    const { departmentId } = req.params;

    const query = `
      SELECT * FROM categories 
      WHERE department_id = $1  = true
      ORDER BY name
    `;

    const result = await pool.query(query, [departmentId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories by department:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        c.*,
        d.name as department_name,
      FROM categories c
      LEFT JOIN departments d ON c.department_id = d.id
      WHERE c.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});


export default router;
