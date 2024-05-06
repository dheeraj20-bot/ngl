'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
Carousel,
CarouselContent,
CarouselItem,
CarouselNext,
CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"
import React from "react";


export default function Home() {
  return (
    <main className="flex-grow flex flex-col 
    items-center justify-center relative
     px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className=" bg-clip-text   text-primary text-3xl md:text-5xl font-bold ">Stranger Messages from strangers</h1>
        <p className="mt-2 text-sm md:text-lg">Explore the world of stranger things :- where your identity is hidden</p>
      </section>
      <Carousel
      plugins={[Autoplay({delay:2000,})]}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>{message.title}</CardHeader>
                <CardContent className="flex flex-col gap-4  p-6">
                  <CardDescription>{message.message}</CardDescription>
                  <CardFooter>{message.received}</CardFooter>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
  );
}
