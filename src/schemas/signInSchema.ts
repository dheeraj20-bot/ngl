import {z} from 'zod'

export const signInschema = z.object({
    identifier:z.string().min(2,"Not valid identifier"),
    password:z.string().min(6,"Not valid password"),
})
