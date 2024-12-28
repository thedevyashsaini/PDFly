"use client";
import { SelectChat, SelectMessage, SelectPdf } from "@/db/schema";
import ChatUI from "./chat-ui";
import { ChatSidebar } from "./sidebar";
import { ChatMessageList } from "./ui/chat/chat-message-list";
import { Subjects } from "@/subjects";
import { useState } from "react";

type ChatWithPDF = Omit<SelectChat, "pdfs"> & {
  pdfs: SelectPdf[];
};

type ClientPageProps = {
  chats: SelectChat[];
  chatWithPdf: ChatWithPDF;
  messages: SelectMessage[];
  subject: Subjects;
  allPdfs: SelectPdf[];
};

const ClientPageComponent = ({
  chats,
  chatWithPdf,
  messages,
  subject,
  allPdfs
}: ClientPageProps) => {
  const [chatPDFs, setPDFs] = useState<SelectPdf[]>(chatWithPdf.pdfs);

  return (
    <ChatSidebar chats={chats} pdfs={chatPDFs} chat_name={chatWithPdf.name}>
      <ChatMessageList className="w-full h-full flex flex-col justify-start text-white space-y-4 mt-8">
        <ChatUI
          messages={messages}
          subject={subject}
          pdfs={chatWithPdf.pdfs}
          chat_id={chatWithPdf.id}
          onUpload={setPDFs}
          allPdfs={allPdfs}
        />
      </ChatMessageList>
    </ChatSidebar>
  );
};

export default ClientPageComponent;
