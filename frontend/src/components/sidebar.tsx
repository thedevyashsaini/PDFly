"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { SelectChat, SelectPdf } from "@/db/schema";

interface SidebarDemoProps {
  children: React.ReactNode;
  chats: SelectChat[];
  pdfs: SelectPdf[];
  chat_name: string;
}

export function ChatSidebar({ children, chats, pdfs, chat_name }: SidebarDemoProps) {
  const chatPDFs = pdfs;
  
  const links = chats.map((chat) => ({
    label: chat.name,
    href: `/app/chat/${chat.id}`,
    icon: <></>,
  }));


  const [open, setOpen] = useState(false);
  
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-black w-full flex-1 max-w-7xl mx-auto overflow-hidden h-[-webkit-fill-available]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="pt-[60px] justify-between gap-10 border-r-[0.5px] border-[#303030]">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col text-white justify-start capitalize">Chat: {chat_name}</div>
            <div className="text-muted-foreground mt-8">PDFs in context</div>
                <div className="mt-2 flex flex-col gap-0">
                {chatPDFs.map((pdf) => (
                    <SidebarLink key={pdf.id} link={{
                        label: pdf.name + ".pdf",
                        href: `#`,
                        icon: <></>
                    }} />
                ))}
                </div>
            <div className="text-muted-foreground mt-8">All Chats</div>
            <div className="mt-2 flex flex-col gap-0">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
