import {z} from 'zod'

export const messageschema = z.object({
    content:z.
    string()
    .min(10,{message:"Message must be at least of 10 characters"})
    .max(300,{message:"Message must be at no longer than 300 characters"})
})
