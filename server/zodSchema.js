import {z} from 'zod'

export const citySchema = z.object({
  name: z.string().min(2),
  province: z.string().min(2),
});

export const citizenSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(9),
  city_id: z.number().int(),
  address: z.string().min(5),
});

export const departmentSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone_number: z.string().min(10),
  city_id: z.string()
});

export const categorySchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  department_id: z.number().int(),
});
  
export const locationSchema = z.object({
  name: z.string().min(3),
  area: z.string().min(2),
  city_id: z.number().int(),
  landmark: z.string().optional(),
});

export const workerSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  department_id: z.string(),
});

export const complaintSchema = z.object({
  citizen_id: z.number().int(),
  category_id: z.number().int(),
  city_id: z.number().int(),
  location_id: z.number().int(),
  title: z.string().min(5),
  description: z.string().min(10),
  priority: z.number().min(1).max(5).optional(),
  status: z
    .enum([
      "pending",
      "assigned",
      "in_progress",
      "resolved",
      "escalated",
      "closed",
    ])
    .optional(),
  created_at: z.string().optional(),
});

export const assignmentSchema = z.object({
  complaint_id: z.number().int(),
  worker_id: z.number().int(),
  assigned_at: z.string().optional(),
});

export const resolutionSchema = z.object({
  complaint_id: z.number().int(),
 category_id: z.number().int(),
  resolved_at: z.string().optional(),
});

export const feedbackSchema = z.object({
  complaint_id: z.number().int(),
  citizen_id: z.number().int(),
  worker_id: z.number().int(),
  department_id: z.number().int(),
  service_rating: z.number().min(1).max(5),
  response_time_rating: z.number().min(1).max(5),
  quality_rating: z.number().min(1).max(5),
  overall_rating: z.number().min(1).max(5),
  comments: z.string().optional(),
  created_at: z.string().optional(),
});

