import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {
  await dbConnect();
  const messageId = params.messageid;
  console.log(messageId);
  const _id = new mongoose.Types.ObjectId(messageId);
  

  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;


  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  console.log(_user._id);
  

  try {
    const updateResult = await UserModel.updateOne(
      {_id:_user._id},
      { $pull: { messages: { _id } } }
    )
    console.log(updateResult);
    

    if(updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }


    return Response.json(
       {
        success: true,
        message: 'Message deleted successfully',
       },
       {
        status: 200
       }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}