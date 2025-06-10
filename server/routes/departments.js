import express from "express";
import pool from "../config/database.js";
import {departmentSchema} from '../zodSchema.js'
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        d.*,
        c.name as city_name,
        COUNT(DISTINCT w.id) as worker_count,
        COUNT(DISTINCT comp.id) as complaint_count,
         ROUND(
        (COUNT(DISTINCT rl.id) * 1.0 / NULLIF(COUNT(DISTINCT w.id), 0)) * 10,
        2
    ) AS efficiency_percent
      FROM departments d
      LEFT JOIN cities c ON d.city_id = c.id
      LEFT JOIN categories cat ON d.id = cat.department_id
      LEFT JOIN workers w ON d.id = w.department_id
      LEFT JOIN complaints comp ON cat.id = comp.category_id
     LEFT JOIN resolution_logs rl ON rl.worker_id = w.id
      GROUP BY d.id, c.name
      ORDER BY d.name
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        d.*,
        c.name as city_name,
        COUNT(DISTINCT cat.id) as category_count,
        COUNT(DISTINCT w.id) as worker_count
      FROM departments d
      LEFT JOIN cities c ON d.city_id = c.id
      LEFT JOIN categories cat ON d.id = cat.department_id
      LEFT JOIN workers w ON d.id = w.department_id
      WHERE d.id = $1
      GROUP BY d.id, c.name
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ error: "Failed to fetch department" });
  }
});


 router.post("/",  async (req, res) => {
try {
       const result = departmentSchema.safeParse(req.body);
       if(!result.success){
        return res.status(400).json({error:result.error.format()});
    }
    let {name,email,phone_number,city_id}= result.data;
       const insertQuery = `
       INSERT INTO departments (name, email, phone_number, city_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *
     `;
    city_id = Number(city_id);
    
      const values = [
         name,
         email,
        phone_number,
        city_id,
       ];       
       const query = await pool.query(insertQuery, values);

       res.status(201).json({
         message: "Department created successfully",
         department: query.rows[0],
       });
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ error: "Failed to create department" });
    }
  }
);

router.get("/:id/workers", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        w.*,
        COUNT(ca.id) as active_assignments
      FROM workers w
      LEFT JOIN complaint_assignments ca ON w.id = ca.worker_id AND ca.is_active = true
      WHERE w.department_id = $1 AND w.is_active = true
      GROUP BY w.id
      ORDER BY w.name
    `;

    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching department workers:", error);
    res.status(500).json({ error: "Failed to fetch department workers" });
  }
});

router.get("/:id/categories", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        c.*,
        COUNT(comp.id) as complaint_count
      FROM categories c
      LEFT JOIN complaints comp ON c.id = comp.category_id
      WHERE c.department_id = $1 AND c.is_active = true
      GROUP BY c.id
      ORDER BY c.name
    `;

    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching department categories:", error);
    res.status(500).json({ error: "Failed to fetch department categories" });
  }
});

export default router;
