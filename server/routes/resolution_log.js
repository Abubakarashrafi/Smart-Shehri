import express from "express";
import pool from "../config/database.js";
import { resolutionSchema } from "../zodSchema.js";


const router = express.Router();

router.post('/',async(req,res) => {
    try {
        const result = resolutionSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ error: result.error.format() });
        }
        let {  complaint_id,category_id} = result.data;
        const getWorker = await pool.query(
          `SELECT w.id
             FROM workers w
             JOIN categories c ON w.department_id = c.department_id
             WHERE c.id = $1
             ORDER BY RANDOM()
             LIMIT 1`,
          [category_id]
        );

        const randomWorkerId = getWorker.rows[0]?.id;
          
        complaint_id = Number(complaint_id)
        const insertQuery = `
        INSERT INTO resolution_logs (complaint_id,worker_id) values ($1,$2)
       
        RETURNING *
      `;

        const values = [
            complaint_id,
            randomWorkerId
             ];
           
             const query = await pool.query(insertQuery, values);

             await pool.query(`update complaints set status='resolved' where id = ${complaint_id}`)
             res.status(201).json({
               message: "resolution_log created successfully",
               resolution: query.rows[0],
             });
    } catch (error) {
        res.status(400).json(error.message);
    }
})

export default router;