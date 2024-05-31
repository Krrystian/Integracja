import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export default registerSchema;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export {loginSchema};