import { z } from 'zod';

// Project Validation
export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must be less than 100 characters'),
  image: z.string().url('Image must be a valid URL').min(1, 'Image is required'),
  githubUrl: z.string().url('GitHub URL must be a valid URL').optional(),
  demoUrl: z.string().url('Demo URL must be a valid URL').optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// Education Validation
export const CreateEducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree must be less than 100 characters'),
  degreeTitle: z.string().min(1, 'Degree title is required').max(200, 'Title must be less than 200 characters'),
  college: z.string().min(1, 'College is required').max(100, 'College must be less than 100 characters'),
  startTime: z.string().min(1, 'Start time is required'),
  graduateTime: z.string().min(1, 'Graduate time is required'),
  certificate: z.string().url('Certificate must be a valid URL').optional().nullable(),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();

// Experience Duty Validation
export const ExperienceDutySchema = z.object({
  name: z.string().min(1, 'Duty name is required').max(100, 'Name must be less than 100 characters'),
  duties: z.array(z.string().min(1, 'Duty description cannot be empty')).min(1, 'At least one duty description is required'),
});

// Experience Validation
export const CreateExperienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(100, 'Job title must be less than 100 characters'),
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  type: z.string().min(1, 'Type is required').max(50, 'Type must be less than 50 characters'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  duties: z.array(ExperienceDutySchema).min(1, 'At least one duty is required'),
});

export const UpdateExperienceSchema = CreateExperienceSchema.partial().extend({
  duties: z.array(ExperienceDutySchema.extend({ id: z.string().optional() })).optional(),
});
