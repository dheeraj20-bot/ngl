import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request:Request){
     await dbConnect()
    
     const session = await getServerSession(authOptions)
     const user:User = session?.user as User 

     if(!session || !user){
        return  Response.json(
            {   
                success:false,
                message:"Unauthorized",
            },
            {status:401})
     }
     
    const userId = user?._id;


    if(!userId){
        return  Response.json(
            {   
                success:false,
                message:"Unauthorized",
            },
            {status:401})
     }

    const { acceptMessages } =  await request.json()

    try {

        const UpdatedUser =await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessages,}
        ,{
            new:true,
        }
        )

        if(!UpdatedUser){
            return  Response.json(
                {   
                    success:false,
                    message:"Failed to accept messages status",
                },
                {status:401})
            
        }
         return  Response.json(
            {   
                success:true,
                message:"Message acceptance status updated successfully",
                UpdatedUser
            },
            {status:200})
        
    } catch (error) {
        console.log("Failed to update user");
        return  Response.json(
            {   
                success:false,
                message:"Unauthorized",
            },
            {status:500})
        
}}


export async function GET(request:Request){
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User 

    if(!session || !user){
       return  Response.json(
           {   
               success:false,
               message:"Unauthorized",
           },
           {status:401})
    }
    
   const userId = user?._id; 

   try {
    const foundUser = await UserModel.findById(userId)

    if(foundUser){
        return Response.json(
            {   
                success:true,
                message:"Message acceptance status retrieved successfully",
                isAcceptingMessage:foundUser.isAcceptingMessage
            },
            {status:200})
    }else{
        return
        Response.json(
            {   
                success:false,
                message:"User not found",
            },
            {status:404})
    }
   } catch (error) {
    console.log("Failed to get user");
    return  Response.json(
        {   
            success:false,
            message:"Unauthorized",
        },
        {status:500})
    
}}

  