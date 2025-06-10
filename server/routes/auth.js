import express from 'express';
const router = express.Router();
import pool from '../config/database.js';
import { citizenSchema } from '../zodSchema.js';



router.post('/', async(req,res) => {
     try {
        const result = citizenSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({error:result.error.format()})
        }
    
        const { fullName, email, phone, city_id, address } =
          result.data;
      
        const userExist = await pool.query(`select * from citizens where name = $1 or email = $2 or phone = $3`,[fullName,email,phone]);
        
        
    
        if(!userExist.rows.length>0) {
            const insertQuery = 
              `INSERT INTO citizens (name, email, phone, city_id, address) VALUES ($1, $2, $3, $4, $5) returning *`
            ;

            const values = [
                fullName,
                email,
                phone,
                city_id,
                address
            ]
            
          
            const createUser = await pool.query(insertQuery, values);
            
            if(!createUser.rows[0]) return res.status(500).json({error:"Something went wrong while creating user"})
                return res.status(200).json(createUser.rows[0]);
            }else return res.status(200).json(userExist.rows[0]);
    
     } catch (error) {
         console.log("error "+error.message);
        
        return res.status(500).json({msg:"Something went wrong"})
     }
})

export default router;