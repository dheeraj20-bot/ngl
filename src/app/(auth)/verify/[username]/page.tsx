'use client'
import { useToast } from "@/components/ui/use-toast";
import { verifyschema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { z } from "zod";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel, FormMessage,
  } from "@/components/ui/form"
import {InputOTP,InputOTPGroup,InputOTPSeparator,InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const VerifyPage = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifyschema>>({
        resolver:zodResolver(verifyschema),
   })

   const onSubmit = async (data:z.infer<typeof verifyschema>)=>{
        try {
           const res = await axios.post(`/api/verify-code`,{username:param.username,code:data.code})
              toast({
                title:"Success",
                variant:"default",
                description: res.data.message,
              })
              router.push("/sign-in")

        } catch (error) {
            console.error(error)
       const axioserror = error as AxiosError<ApiResponse>
       toast({
        title:"Error",
        description:axioserror.response?.data.message ?? "Error signing up",
        variant:"destructive"
       })
        }
   }

    return (
        <div className="flex justify-center items-center
         min-h-screen bg-gray-100">
         <div className="w-full max-w-md p-8 
       space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight 
         lg:text-5xl mb-6
         ">Join Stranger</h1>
         <p className="mb-4 text-gray-500">Sign up to get started</p>
          </div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 mx-auto space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator/>
                    <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
 
        <Button type="submit">Submit</Button>
      </form>
    </Form>
          </div>    
        </div>
    );
};

export default VerifyPage;
