"use client";
import { CornerDownLeft, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "./ui/chat/chat-bubble";
import { ChatInput } from "./ui/chat/chat-input";
import { SelectMessage, SelectPdf } from "@/db/schema";
import { Subjects } from "@/subjects";
import { useEffect, useRef, useState } from "react";
import { PDFUpload } from "./pdf-upload";
import ChatPDFUpload from "./chat-upload-pdf";

const ChatUI = ({
  messages,
  subject,
  pdfs,
  chat_id,
  allPdfs,
  onUpload,
}: {
  messages: SelectMessage[];
  subject: Subjects;
  pdfs: SelectPdf[];
  chat_id: string;
  allPdfs: SelectPdf[];
  onUpload: (pdfs: SelectPdf[]) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<SelectMessage[]>(messages);
  const [showUpload, setShowUpload] = useState(false);
  const [chatPdfs, setPDFs] = useState<SelectPdf[]>(pdfs);

  const uploadHandler = (pdf: SelectPdf[]) => {
    setPDFs((pdfs) => [...pdfs, ...pdf]);
    onUpload([...chatPdfs, ...pdf]);
    setShowUpload(false);
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message: string | undefined =
      e.currentTarget.querySelector("textarea")?.value;

    if (!message) {
      return;
    }

    setLoading(true);
    const textarea = e.currentTarget.querySelector("textarea");
    if (textarea) {
      textarea.value = "";
    }
    setChatMessages((chatMessages) => [
      ...chatMessages,
      {
        id: Math.random().toString(36).substring(7),
        raw: message,
        is_generated: false,
        chat_id,
        timestamp: new Date(),
        references: {},
      },
    ]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1/chat/new/message`,
      {
        method: "POST",
        body: JSON.stringify({
          user_id: subject.properties.id,
          chat_id,
          message,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      setLoading(false);
      throw new Error("Failed to send message, please try again.");
    }

    const data = await response.json();

    if (!data.success) {
      setLoading(false);
      throw new Error("Failed to send message, please try again.");
    }

    setChatMessages((chatMessages) => [...chatMessages, data.response]);
    setLoading(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      console.log("pressed in");
      e.preventDefault();
      document
        .getElementById("chat-message-form")
        ?.dispatchEvent(new SubmitEvent("submit", { bubbles: true, cancelable: true }));
    }
  };

  return (
    <>
      <div className="w-full px-2 md:px-8 flex flex-col space-y-4 pb-[130px]">
        <ChatBubble variant="received">
          <ChatBubbleAvatar fallback="AI" className="border border-[#303030]" />
          <ChatBubbleMessage
            variant={"received"}
            className="bg-primary text-white text-sm"
          >
            Hey {subject.properties.name}! I'm your PDFly assistant. I'll help
            you talk to your PDFs, and see what's inside ;)
            <br />
            <br />
            You can ask me querries related to these PDFs: <br />
            <br />
            {chatPdfs.map((pdf) => pdf.name + ".pdf").join(", ")}
          </ChatBubbleMessage>
        </ChatBubble>
        {chatMessages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.is_generated ? "received" : "sent"}
          >
            <ChatBubbleAvatar
              src={message.is_generated ? "" : subject.properties.pfp}
              fallback={message.is_generated ? "AI" : "US"}
              className="border border-[#303030]"
            />
            <ChatBubbleMessage
              variant={message.is_generated ? "received" : "sent"}
              className="bg-primary text-white text-sm"
            >
              {message.raw}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
        <div ref={messagesEndRef} />
        {loading && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar
              fallback="AI"
              className="border border-[#303030]"
            />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </div>
      <form
        id="chat-message-form"
        onSubmit={sendMessage}
        style={{maxWidth:"calc(80rem - 250px)"}}
        className="fixed right-0 custom-width custom-right w-full bottom-0 rounded-t-lg border-[#303030] border bg-black focus-within:ring-1 focus-within:ring-ring p-1"
      >
        {showUpload && (
        <ChatPDFUpload allPdfs={allPdfs} currentPDFs={chatPdfs} subject={subject} chat_id={chat_id} onUpload={uploadHandler}/>
        )}
        <ChatInput
          disabled={loading || showUpload}
          placeholder="Type your message here..."
          onKeyDown={handleKeyDown}
          className="min-h-12 resize-none rounded-lg bg-black border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-right p-3 pt-0">
          {chatPdfs.length < 3 && (
            <Button
              size="sm"
              className="ml-auto gap-1.5"
              disabled={loading}
              onClick={() => setShowUpload(!showUpload)}
            >
              {!showUpload ? "Add PDFs" : "Close"}
              <Paperclip className="size-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            type="submit"
            disabled={loading || showUpload}
            className={`${chatPdfs.length < 3 ? "ml-2" : "ml-auto"} gap-1.5`}
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChatUI;
