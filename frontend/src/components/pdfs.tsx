import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectPdf } from "@/db/schema";

export function PDFS({ pdfs }: { pdfs: SelectPdf[] }) {
  return pdfs.length > 0 ? (
    <Carousel className="w-full max-w-[80%]">
      <CarouselContent className="-ml-1">
        {pdfs.map((pdf) => (
          <CarouselItem
            key={pdf.id}
            className="pl-1 basis-1/1 md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1">
              <Card className="bg-black text-white border-[#505050]">
                <CardContent className="flex w-fit items-center justify-center p-6">
                  <span className="text-md">{pdf.name}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-black"/>
      <CarouselNext className="bg-black"/>
    </Carousel>
  ) : (
    <>
    <span className="place-self-start text-[#707070]">Nothing&apos;s here...</span>
    </>
  );
}