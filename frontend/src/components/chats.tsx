import { SelectChat } from "@/db/schema";
import { ExternalLink } from "lucide-react";

const Chats = ({chats} : {chats: SelectChat[]}) => {
  return (
    <div className="flex flex-col w-full flex-start">
      {chats.map((chat) => (
        <a href={`/app/chat/${chat.id}`} key={chat.id}>
          <div className="rounded-md border border-[#303030] px-4 py-3 font-mono text-md flex flex-row w-full justify-between cursor-pointer">
            {chat.name}
            <ExternalLink />
          </div>
        </a>
      ))}
    </div>
  );
};

export default Chats;