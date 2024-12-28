import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Subjects } from "@/subjects";
import { redirect } from "next/navigation";
import { set } from "zod";
import { SelectPdf } from "@/db/schema";

export function PDFUpload({
  subject,
  chat_id,
  onUpload,
}: {
  subject: Subjects;
  chat_id: string | boolean;
  onUpload: (pdf: SelectPdf[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Uploading...");

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", subject.properties.id);
    formData.append("pdf", files[0]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/pdf/add`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload PDF");
    }

    console.log(response);

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to upload PDF");
    }

    if (!chat_id) {
      setLoadingText("Initializing Chat!");

      const chatResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/new`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: subject.properties.id,
            pdfs: [data.pdf.id],
            name: `New Chat - ${data.pdf.name}`,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!chatResponse.ok) {
        throw new Error("Failed to initialise chat, please try again.");
      }

      const chatData = await chatResponse.json();

      if (!chatData.success) {
        throw new Error("Failed to initialise chat, please try again.");
      }

      redirect(`/app/chat/${chatData.chat.id}`);
    } else {
        setLoadingText("Adding PDF to Chat!");

        const chatResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/new/pdf`,
          {
            method: "POST",
            body: JSON.stringify({
              user_id: subject.properties.id,
              pdf_id: data.pdf.id,
              chat_id,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!chatResponse.ok) {
          throw new Error("Failed to add PDF to chat, please try again.");
        }

        const chatData = await chatResponse.json();

        if (!chatData.success) {
          throw new Error("Failed to add PDF to chat, please try again.");
        }

        setLoadingText("PDF added to chat!");
        onUpload([data.pdf]);
    }
  };

  return !loading ? (
    <div className="w-full max-w-4xl mx-auto min-h-96 border bg-black border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  ) : (
    <span>{loadingText}</span>
  );
}
