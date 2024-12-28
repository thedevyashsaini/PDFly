"use client";
import { SelectChat, SelectPdf } from "@/db/schema";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Chats from "./chats";
import { Subjects } from "@/subjects";
import NewChat from "./new-chat";

export const Chatsection = ({
  chats,
  pdfs,
  subject,
}: {
  chats: SelectChat[];
  pdfs: SelectPdf[];
  subject: Subjects;
}) => {
  const [showUpload, setShowUpload] = useState(false);
  return (
    <>
      <h1 className="place-self-start text-2xl mt-8">
        Your Chats{" "}
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
      <Chats chats={chats} />
      {showUpload ? <NewChat subject={subject} pdfs={pdfs}/> : <></>}
    </>
  );
};
