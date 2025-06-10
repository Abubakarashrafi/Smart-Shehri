import express  from 'express';
const router = express.Router();
import pool from '../config/database.js';
import {complaintSchema} from '../zodSchema.js';


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const city_id = req.query.city_id;
    const category_id = req.query.category_id;
    const priority = req.query.priority;

    let whereClause = "WHERE 1=1";
    const queryParams = [];
    let paramCounter = 1;

    if (status) {
      whereClause += ` AND c.status = $${paramCounter}`;
      queryParams.push(status);
      paramCounter++;
    }

    if (city_id) {
      whereClause += ` AND c.city_id = $${paramCounter}`;
      queryParams.push(city_id);
      paramCounter++;
    }

    if (category_id) {
      whereClause += ` AND c.category_id = $${paramCounter}`;
      queryParams.push(category_id);
      paramCounter++;
    }

    if (priority) {
      whereClause += ` AND c.priority = $${paramCounter}`;
      queryParams.push(priority);
      paramCounter++;
    }

    const query = `
        SELECT 
          c.*,
          cit.name as citizen_name,
          cit.email as citizen_email,
          cat.name as category_name,
          city.name as city_name,
          loc.name as location_name,
          d.name as department_name
        FROM complaints c
        JOIN citizens cit ON c.citizen_id = cit.id
        JOIN categories cat ON c.category_id = cat.id
        JOIN cities city ON c.city_id = city.id
        LEFT JOIN locations loc ON c.location_id = loc.id
        LEFT JOIN departments d ON cat.department_id = d.id
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
      `;

    queryParams.push(limit, offset);

    const countQuery = `
        SELECT COUNT(*) 
        FROM complaints c
        ${whereClause}
      `;

    const [complaints, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2)),
    ]);

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      complaints: complaints.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});
  
router.post('/',async(req,res) => {
    try {
        const result = complaintSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({error:result.error.format()});
        }
        const {citizen_id ,category_id, city_id,location_id, title,description,priority} = result.data;
        const insertQuery = `INSERT INTO complaints (citizen_id, category_id, city_id, location_id, title, description, priority) VALUES ($1, $2, $3, $4, $5, $6, $7)
            returning *
        `;
    
        const values = [
          citizen_id,
          category_id,
          city_id,
          location_id,
          title,
          description,
          priority,
        ];
        const createComplaint = await pool.query(insertQuery,values);
        
        res.status(201).json({
          message: "Complaint submitted successfully",
          complaint: createComplaint.rows[0],
        });
    } catch (error) {
        console.log(error.message);
        res.status(501).json({error: "Failed to create complaint"});
    } 
})

export default router