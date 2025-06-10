import express from "express";
import pool from "../config/database.js";
import { citySchema } from "../zodSchema.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const query = `
      select
        *
        FROM cities 
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        c.*,
        COUNT(comp.id) as complaint_count,
        COUNT(CASE WHEN comp.status = 'resolved' THEN 1 END) as resolved_count
      FROM cities c
      LEFT JOIN complaints comp ON c.id = comp.city_id
      WHERE c.id = $1
      GROUP BY c.id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ error: "Failed to fetch city" });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = citySchema.safeParse(req.body);
    //  console.log(result);

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }
    let { name, province } = result.data;

    const insertQuery = `
    INSERT INTO cities (name, province)
    VALUES ($1, $2)
    RETURNING *
  `;

    const values = [name, province];


    const query = await pool.query(insertQuery, values);

    res.status(201).json({
      message: "city added successfully",
      city: query.rows[0],
    });
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ error: "Failed to create city" });
  }
});


router.get("/:id/locations", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT * FROM locations 
      WHERE city_id = $1 
      ORDER BY name
    `;

    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching city locations:", error);
    res.status(500).json({ error: "Failed to fetch city locations" });
  }
});

export default router;
