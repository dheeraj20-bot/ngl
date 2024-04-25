import {z} from 'zod'

const usernameRegex = /^[a-zA-Z0-9._-]+$/;

export const usernameValidation = z
          .string()
          .min(2,'Username must be atleast 2 characters')
          .max(20,'Username must be no more than 20 characters')
          .regex(usernameRegex,'Username must not contain special character')

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email Address"}),
    password:z.string().min(6,{message:'Password must be atleast 6 characters'})
})