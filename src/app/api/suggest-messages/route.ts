import { OpenAIStream, StreamingTextResponse, streamText } from 'ai'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

//set the runtime
export const runtime = 'edge'

//set the handler

export async function POST(req: Request){
   try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '|||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.target Audience is 18 to 25 so message should be suitable for them.add some flirting questions , some double meaning questions and some engaging questions. so people can interest on it and engage with it. something sexting and engaging questions. as per rules and regulations. use sexting words and phrases."

    const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        max_tokens: 400,
        stream: true,
        prompt
    });
    //convert the response into a friendly text-stream
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

   } catch (error) {
      if (error instanceof OpenAI.APIError) {
          const {name,status,headers,message} = error
          return NextResponse.json({name,status,headers,message}, {status})
      }else {
         console.error("An Unexpected error occured", error);
         throw error
      }
   }
}