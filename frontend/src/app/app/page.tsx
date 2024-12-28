import { auth, login } from "../actions";
import { SelectChat, SelectPdf } from "@/db/schema";
import {PDFsection} from "@/components/pdf-section-app";
import { Chatsection } from "@/components/chat-section-app";

const app = async () => {
  const subject = await auth();

  if (!subject) {
    login();
    return;
  }

  const pdfResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/pdf/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: subject.properties.id }),
    }
  );

  console.log(pdfResponse);

  if (!pdfResponse.ok) {
    throw new Error("Failed to fetch PDFs 11");
  }

  const pdfData = await pdfResponse.json();

  console.log(pdfData);

  if (!pdfData.success) {
    throw new Error("Failed to fetch PDFs 22");
  }

  const pdfs = pdfData.pdfs.map((pdf: Omit<SelectPdf, "uploaded"> & { uploaded: string | number | Date; }) => ({
    ...pdf,
    uploaded: new Date(pdf.uploaded)
  })) as SelectPdf[];


  const chatResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: subject.properties.id }),
    }
  );

  if (!chatResponse.ok) {
    throw new Error("Failed to fetch Chats 11");
  }

  const chatData = await chatResponse.json();

  if (!chatData.success) {
    throw new Error("Failed to fetch Chats 22");
  }

  console.log(chatData);

  const chats = chatData.chats as SelectChat[];

  return (
    <div className="w-full flex flex-col items-center text-white px-16 md:px-32 space-y-4 mt-8">
      <PDFsection pdfs={pdfs} subject={subject}/>
      <Chatsection chats={chats} subject={subject} pdfs={pdfs} />
    </div>
  );
};

export default app;
