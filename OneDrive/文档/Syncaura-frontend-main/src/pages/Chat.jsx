import { useEffect, useState } from "react";
import Sidebar from "../components/chats/ChatSideBar/Sidebar";
import ChatWindow from "../components/chats/ChatWindow/ChatWindow";
import { CHATS } from "../constant/constant";
import ProfilePanel from "../components/chats/ProfilePanel";


// ---------------- Mock Data ----------------



export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [selectedChat?.id]);


  return (
    <div className="h-[calc(100vh-3.3rem)] xl:h-[calc(100vh-4.9rem)] w-full mt-1 flex bg-gray-100 dark:bg-[#121212] transition-colors duration-500">
      <Sidebar
        chats={CHATS}
        selectedChat={selectedChat}
        onSelect={setSelectedChat}
      />

      <ChatWindow
        chat={selectedChat}
        setOpen={setOpen}
        onBack={() => setSelectedChat(null)}
      />
    
      <ProfilePanel
        isOpen={open}
        onClose={() => setOpen(false)}
        profile={selectedChat?.profile}
        chatDetails={selectedChat?.chatDetails}
        files={selectedChat?.files || []}
      />
    </div>
  );
}


