import express from "express";
import pool from "../config/database.js";
import {workerSchema} from '../zodSchema.js'
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        w.*,
        d.name as department_name,
        COUNT(ca.id) as active_assignments
      FROM workers w
      LEFT JOIN departments d ON w.department_id = d.id
      LEFT JOIN complaint_assignments ca ON w.id = ca.worker_id
      GROUP BY w.id, d.name
      ORDER BY w.name
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching workers:", error);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        w.*,
        d.name as department_name,
        COUNT(ca.id) as active_assignments,
        COUNT(rl.id) as total_resolutions
      FROM workers w
      LEFT JOIN departments d ON w.department_id = d.id
      LEFT JOIN complaint_assignments ca ON w.id = ca.worker_id
      LEFT JOIN resolution_logs rl ON w.id = rl.worker_id
      WHERE w.id = $1
      GROUP BY w.id, d.name
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Worker not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching worker:", error);
    res.status(500).json({ error: "Failed to fetch worker" });
  }
});

 router.post("/",async (req, res) => {
     try {
       const result = workerSchema.safeParse(req.body);
      //  console.log(result);
       
             if(!result.success){
              return res.status(400).json({error:result.error.format()});
          }
       let {
         name,
         email,
         phone,
         department_id,
       } = result.data;

       department_id = Number(department_id);
      const insertQuery = `
       INSERT INTO workers (name, email, phone,  department_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *
     `;

       const values = [
       name,
       email,
       phone,
       department_id
       ];
     
      //  console.log(values);
       
       const query = await pool.query(insertQuery, values);

       res.status(201).json({
         message: "Worker created successfully",
         worker: query.rows[0],
       });
     } catch (error) {
       console.error("Error creating worker:", error);
         res.status(500).json({ error: "Failed to create worker" });
       }
     }
 );


router.get("/:id/assignments", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        ca.*,
        c.title as complaint_title,
        c.status as complaint_status,
        c.priority,
        c.created_at as complaint_created_at,
        cit.name as citizen_name,
        cat.name as category_name
      FROM complaint_assignments ca
      JOIN complaints c ON ca.complaint_id = c.id
      JOIN citizens cit ON c.citizen_id = cit.id
      JOIN categories cat ON c.category_id = cat.id
      WHERE ca.worker_id = $1 
      ORDER BY ca.assigned_at DESC
    `;

    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching worker assignments:", error);
    res.status(500).json({ error: "Failed to fetch worker assignments" });
  }
});

router.get("/available/:departmentId", async (req, res) => {
  try {
    const { departmentId } = req.params;

    const query = `
      SELECT 
        w.*,
        COUNT(ca.id) as current_assignments
      FROM workers w
      LEFT JOIN complaint_assignments ca ON w.id = ca.worker_id 
      WHERE w.department_id = $1 
      GROUP BY w.id
      HAVING COUNT(ca.id) < w.max_concurrent_assignments
      ORDER BY COUNT(ca.id), w.name
    `;

    const result = await pool.query(query, [departmentId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching available workers:", error);
    res.status(500).json({ error: "Failed to fetch available workers" });
  }
});

export default router;
