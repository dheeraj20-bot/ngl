"use client"
import * as z  from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios ,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const SignupPage = () => {
  const {toast} = useToast()
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] =useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
       resolver:zodResolver(signUpSchema),
       defaultValues:{
        username:"",
        email:"",
        password:""
       }
  })
  
  useEffect(()=>{
   const checkUsernameValidation = async ()=>{
     if(username.length){
       setIsCheckingUsername(true)
       setUsernameMessage("")
       try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
          setIsCheckingUsername(false)
       } catch (error) {
          const axioserror = error as AxiosError<ApiResponse>
          setUsernameMessage(axioserror.response?.data.message ?? "Error checking username")
       }finally{
        setIsCheckingUsername(false)
       }

     }
   }
   checkUsernameValidation()
  },[username])

  const onSubmit = async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true)
    try {
           const response = await axios.post<ApiResponse>("/api/sign-up",data)
           toast({
            title:"Success",
            description:response.data.message,
           })
           router.replace(`/verify/${username}`)
           setIsSubmitting(false) 
    } catch (error) {
       console.error(error)
       const axioserror = error as AxiosError<ApiResponse>
       toast({
        title:"Error",
        description:axioserror.response?.data.message ?? "Error signing up",
        variant:"destructive"
       })
       setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center 
    items-center min-h-screen bg-gray-100">
       <div className="w-full max-w-md p-8 
       space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
        <h1 className="text-4xl text-primary  font-extrabold tracking-tight 
         lg:text-5xl mb-6
         ">Join Stranger</h1>
         <p className="mb-4  font-medium">Sign up to get started</p>
        </div>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Dheeraj Kumar" {...field}
                onChange={(e)=>{ field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              {isCheckingUsername && <Loader2 className="animate-spin h-5 w-5 mr-2"/>}
            {usernameMessage && <FormDescription className={`text-sm ${usernameMessage==="Username is unique" ? "text-green-500" : "text-red-500"}`}>{usernameMessage}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="dheeraj@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input  type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="" type="submit" disabled={isSubmitting}>{isSubmitting ? <> <Loader2 className="animate-spin h-5 w-5 mr-2"/>Submitting...</> : "Sign up"}</Button>
      </form>
        </Form>
        <div className="text-center">
        Already have an account? <Link className="text-orange-500" href="/sign-in">Login</Link>
        </div>
       </div>
       
    </div>
  )
}

export default SignupPage