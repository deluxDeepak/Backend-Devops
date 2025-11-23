const z = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(25).trim(),
    email: z.string().email("Enter a valid email").trim().toLowerCase(),
    password: z.string().min(6).max(100)
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    password: z.string().min(6)
  }),
});

module.exports = {
    registerSchema,
    loginSchema
}