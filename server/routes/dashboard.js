import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM complaints) as total_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'pending') as pending_complaints,
        (SELECT COUNT(*) FROM resolution_logs) as resolved_complaints,
        (SELECT COUNT(*) FROM citizens) as total_citizens,
        (SELECT COUNT(*) FROM departments) as active_departments,
        (SELECT ROUND(AVG(overall_rating), 2) FROM feedback_ratings) as average_rating
    `;

    const result = await pool.query(statsQuery);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});


router.get("/complaints-by-city", async (req, res) => {
  try {
    const query = `
      SELECT 
        c.name as city_name,
        COUNT(comp.id) as complaint_count,
      COUNT(rl.id) AS resolved_count
      FROM cities c
      LEFT JOIN complaints comp ON c.id = comp.city_id
      LEFT JOIN resolution_logs rl ON rl.complaint_id = comp.id
      GROUP BY c.id, c.name
      ORDER BY complaint_count DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints by city:", error);
    res.status(500).json({ error: "Failed to fetch complaints by city" });
  }
});


router.get("/complaints-by-category", async (req, res) => {
  try {
    const query = `
      SELECT 
        cat.name as category_name,
        COUNT(comp.id) as complaint_count
      FROM categories cat
      LEFT JOIN complaints comp ON cat.id = comp.category_id
      GROUP BY cat.id, cat.name
      ORDER BY complaint_count DESC
    `;

    const result = await pool.query(query);
    
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints by category:", error);
    res.status(500).json({ error: "Failed to fetch complaints by category" });
  }
});

router.get("/department-ratings", async (req, res) => {
  try {
    const query = `
      SELECT 
        d.name as department_name,
        ROUND(AVG(f.overall_rating), 2) as avg_rating,
        ROUND(AVG(f.service_rating), 2) as avg_service_rating,
        ROUND(AVG(f.response_time_rating), 2) as avg_response_time,
        COUNT(f.id) as total_feedback
      FROM departments d
      LEFT JOIN feedback_ratings f ON d.id = f.department_id
      GROUP BY d.id, d.name
      ORDER BY avg_rating DESC NULLS LAST
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching department ratings:", error);
    res.status(500).json({ error: "Failed to fetch department ratings" });
  }
});

router.get("/monthly-trends", async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as complaint_count,
        (select count(*) from resolution_logs) as resolved_count
      FROM complaints
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching monthly trends:", error);
    res.status(500).json({ error: "Failed to fetch monthly trends" });
  }
});

router.get("/priority-distribution", async (req, res) => {
  try {
    const query = `
      SELECT 
        priority,
        COUNT(*) as count,
        CASE 
          WHEN priority = 1 THEN 'Very Low'
          WHEN priority = 2 THEN 'Low'
          WHEN priority = 3 THEN 'Medium'
          WHEN priority = 4 THEN 'High'
          WHEN priority = 5 THEN 'Critical'
        END as priority_label
      FROM complaints
      GROUP BY priority
      ORDER BY priority
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching priority distribution:", error);
    res.status(500).json({ error: "Failed to fetch priority distribution" });
  }
});

router.get("/recent-complaints", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const query = `
      SELECT 
        c.id,
        c.title,
        c.status,
        c.priority,
        c.created_at,
        cit.name as citizen_name,
        city.name as city_name,
        cat.name as category_name
      FROM complaints c
      JOIN citizens cit ON c.citizen_id = cit.id
      JOIN cities city ON c.city_id = city.id
      JOIN categories cat ON c.category_id = cat.id
      ORDER BY c.created_at DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching recent complaints:", error);
    res.status(500).json({ error: "Failed to fetch recent complaints" });
  }
});

export default router;
