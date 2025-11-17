const z = require('zod');

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(25),
        email: z.string().email(),
        password: z.string().min(6).max(100)
    }),
})
// Email must be valid 
// Password strong 

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
})

module.exports = {
    registerSchema,
    loginSchema
}