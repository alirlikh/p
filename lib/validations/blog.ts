import { z } from 'zod';

// Reserved slugs that cannot be used for blog posts
const RESERVED_SLUGS = [
  'api',
  'admin',
  'auth',
  'login',
  'logout',
  'dashboard',
  'new',
  'edit',
  'delete',
  '_next',
  'public',
  'static',
  'create',
];

// Slug validation schema
export const SlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be less than 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only')
  .refine((slug: string) => !RESERVED_SLUGS.includes(slug), {
    message: 'This slug is reserved and cannot be used',
  });

// Create post schema
export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: SlugSchema,
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  categoryIds: z.array(z.string()).max(5, 'Maximum 5 categories allowed').optional(),
  tagIds: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
});

// Update post schema (all fields optional except what's being updated)
export const UpdatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: SlugSchema.optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
  categoryIds: z.array(z.string()).max(5).optional(),
  tagIds: z.array(z.string()).max(10).optional(),
});

// Query posts schema (for filtering/pagination)
export const QueryPostsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  published: z
    .string()
    .transform((val: string) => val === 'true')
    .optional(),
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  search: z.string().optional(),
});

// Category schema
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name must be less than 50 characters'),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

// Tag schema
export const CreateTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(30, 'Name must be less than 30 characters'),
  slug: z
    .string()
    .min(1)
    .max(30)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

// Update schemas for category and tag
export const UpdateCategorySchema = CreateCategorySchema.partial();
export const UpdateTagSchema = CreateTagSchema.partial();

