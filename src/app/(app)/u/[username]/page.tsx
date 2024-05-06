"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { messageschema } from '@/schemas/messageSchema';
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

interface Props {
    params: {
    username: string;
    }
}


const SendMessagePage = ({params:{username}}:Props) => {
    const form = useForm<z.infer<typeof messageschema>>({
        resolver: zodResolver(messageschema),
    })

   async function onSubmit(data: z.infer<typeof messageschema>) {
        try {
           const res =  await axios.post<ApiResponse>('/api/send-message', {username,content: data.content})
           toast({
            title: "Message Sent",
            description: res.data.message,
          })
          form.reset()
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
        <section className='max-w-4xl text-center flex flex-col  mx-auto px-4 py-20 sm:px-6 lg:px-3' >
            <h1 className='text-2xl  font-bold text-gray-800'>Send Stranger Messgaes to{" "} <span className='text-primary'> {username}</span></h1>
             
             <section className='mt-10 '>
             <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="w-full  space-y-6">
           <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Message to Stranger Like you @{username}</FormLabel>
              <FormControl>
                <Textarea                  
                  placeholder="Every Conversation starts with a Message"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
   </section>
</section>
    );
};

export default SendMessagePage;
