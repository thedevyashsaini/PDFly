"use client";
import { Minus, Plus } from "lucide-react";
import { PDFUpload } from "@/components/pdf-upload";
import { SelectPdf } from "@/db/schema";
import { PDFS } from "@/components/pdfs";
import { Subjects } from "@/subjects";
import { useState } from "react";

export const PDFsection = ({
  pdfs,
  subject,
}: {
  pdfs: SelectPdf[];
  subject: Subjects;
}) => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <h1 className="place-self-start text-2xl">
        Your PDFs{" "}
        {!showUpload ? (
          <Plus
            className="inline mb-2 border rounded-full ml-2 cursor-pointer"
            onClick={() => {
              setShowUpload(!showUpload);
            }}
          />
        ) : (
          <Minus
            className="inline mb-2 border rounded-full ml-2 cursor-pointer"
            onClick={() => {
              setShowUpload(!showUpload);
            }}
          />
        )}
      </h1>
      <PDFS pdfs={pdfs} />
      {showUpload ? <PDFUpload subject={subject} chat_id={false} onUpload={() => {}} /> : <></>}
    </>
  );
};
