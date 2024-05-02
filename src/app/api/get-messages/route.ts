import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import { log } from "console";

export async function GET(request: Request) {
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
    
    const userId = new mongoose.Types.ObjectId(user.id)
    try {
         const user = await UserModel.aggregate([
            {
                $match:{
                    id:userId
                }
            },
            {$unwind:'#messages'},
            {$sort:{"messages.createdAt" : -1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}},
         ])

    if(!user || user.length === 0){
        return Response.json(
            {   
                success:false,
                message:"User not found",
            },
            {status:401})
    }
     
    return Response.json(
        {   
            success:true,
            data:user[0].messages,
        },
        {status:200})

     } catch (error) {
        console.log("Failed to get messages");
        return  Response.json(
            {   
                success:false,
                message:"Unauthorized",
            },
            {status:500})
        
    }
}

