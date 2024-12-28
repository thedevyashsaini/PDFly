import { auth, login } from "@/app/actions";
import ClientPageComponent from "@/components/client-page";
import { SelectChat, SelectMessage, SelectPdf } from "@/db/schema";

type ChatWithPDF = Omit<SelectChat, "pdfs"> & {
  pdfs: SelectPdf[];
};

const ChatPage = async ({
  params,
}: {
  params: Promise<{ chat_id: string }>;
}) => {
  const chat_id = (await params).chat_id;
  const subject = await auth();

  if (!subject) {
    login();
    return;
  }

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

  const chat = chats.find((chat) => chat.id === chat_id);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const messageResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/messages/${chat.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: subject.properties.id }),
    }
  );

  if (!messageResponse.ok) {
    throw new Error("Failed to fetch Messages 11");
  }

  const messageData = await messageResponse.json();

  if (!messageData.success) {
    throw new Error("Failed to fetch Messages 22");
  }

  console.log(messageData);

  const messages = messageData.messages as SelectMessage[];

  const chatPDFResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/get/${chat.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: subject.properties.id }),
    }
  );

  console.log("-->" + chatPDFResponse);

  if (!chatPDFResponse.ok) {
    throw new Error("Failed to fetch PDFs 11");
  }

  const withPdfData = await chatPDFResponse.json();

  console.log(withPdfData);

  if (!withPdfData.success) {
    throw new Error("Failed to fetch PDFs 22");
  }

  const chatWithPdf = withPdfData.chat as ChatWithPDF;

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

  if (!pdfResponse.ok) {
    throw new Error("Failed to fetch PDFs 11");
  }

  const pdfData = await pdfResponse.json();

  console.log(pdfData);

  if (!pdfData.success) {
    throw new Error("Failed to fetch PDFs 22");
  }

  const allPdfs = pdfData.pdfs.map((pdf: Omit<SelectPdf, "uploaded"> & { uploaded: string | number | Date; }) => ({
    ...pdf,
    uploaded: new Date(pdf.uploaded)
  })) as SelectPdf[];

  return (
    <ClientPageComponent chats={chats} chatWithPdf={chatWithPdf} messages={messages} subject={subject} allPdfs={allPdfs}/>
  );
};

export default ChatPage;
