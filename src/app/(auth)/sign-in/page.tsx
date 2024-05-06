"use client"
import React from "react"
import * as z  from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios ,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { signInschema } from "@/schemas/signInSchema"
import { title } from "process"

const SignInPage = () => {
  const {toast} = useToast()
  const [isSubmitting,setIsSubmitting] =useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInschema>>({
       resolver:zodResolver(signInschema),
       defaultValues:{
        identifier:"",
        password:""
       }
  })
  
  const onSubmit = async (data:z.infer<typeof signInschema>)=>{
    setIsSubmitting(true)
   const res = await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    if(res?.error){
      toast({
        title:"Login Failed",
        description:res?.error,
        variant:"destructive"
      })
    }
    if(res?.url) {
      setIsSubmitting(false)
      toast({
        title:"Login ",
        description:"Invalid Credentials",
      }) 
      router.replace('/dashboard')
    }
             
  }
  return (
    <div className="flex justify-center 
    items-center min-h-screen bg-gray-100">
       <div className="w-full max-w-md p-8 
       space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
        <h1 className="text-4xl text-primary font-extrabold tracking-tight 
         lg:text-5xl mb-6
         ">Join Stranger</h1>
         <p className="mb-4 font-medium ">Lets Start your Journey</p>
        </div>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or Username</FormLabel>
              <FormControl>
                <Input placeholder="dheeraj@gmail.com or dheeraj" {...field} />
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
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <> <Loader2 className="animate-spin h-5 w-5 mr-2"/>Submitting...</> : "Sign up"}</Button>
      </form>
        </Form>
        <div className="text-center text-gray-500"> 
        </div>
       </div>
    </div>
  )
}

export default SignInPage