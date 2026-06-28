import { ArrowLeft, MoreVertical, Phone, Search } from "lucide-react";
import Avatar from "../Avatar";
import { useState, useRef, useEffect } from "react";

export default function ChatHeader({ chat, onBack, setOpen }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setOpen(true);
  };

  const handlePhoneClick = (e) => {
    e.stopPropagation();
    console.log("Phone clicked");
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
    console.log("Search clicked");
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleBackClick = (e) => {
    e.stopPropagation();
    onBack();
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    
    switch (action) {
      case "viewProfile":
        setOpen(true);
        break;
      case "muteNotifications":
        console.log("Mute notifications for:", chat.name);
        // Add mute logic
        break;
      case "clearChat":
        console.log("Clear chat for:", chat.name);
        // Add clear chat logic
        break;
      case "deleteChat":
        console.log("Delete chat for:", chat.name);
        // Add delete chat logic
        break;
      case "blockUser":
        console.log("Block user:", chat.name);
        // Add block user logic
        break;
    }
  };

  return (
    <div className="h-16 flex items-center justify-between px-4 border-b bg-[#FFFFFF] dark:bg-[#2E2F2F]">
      {/* Profile section */}
      <div
        onClick={handleProfileClick}
        className="flex items-center gap-3 cursor-pointer"
      >
        {/* Back button (mobile only) */}
        <button onClick={handleBackClick} className="md:hidden">
          <ArrowLeft size={20} className="text-black dark:text-gray-300" />
        </button>

        <Avatar label={chat.avatar} gradient={chat.gradient} />

        <div>
          <p className="font-semibold text-lg text-black dark:text-white">
            {chat.name}
          </p>
          <p className="text-sm text-black dark:text-white">Last seen yesterday</p>
        </div>
      </div>

      {/* Action icons */}
      <div className="flex gap-4 xl:gap-7 text-gray-600 dark:text-gray-400 relative">
        <Phone onClick={handlePhoneClick} className="cursor-pointer" />
        <Search onClick={handleSearchClick} className="cursor-pointer" />
        
        {/* Three dot menu */}
        <div ref={menuRef}>
          <MoreVertical onClick={handleMoreClick} className="cursor-pointer" />

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#2E2F2F] border border-[#E0DDDD] dark:border-[#575757] rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={() => handleMenuAction("viewProfile")}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white text-base flex items-center gap-3"
              >
                <span className="size-5 flex items-center justify-center">👤</span>
                View Profile
              </button>

              <button
                onClick={() => handleMenuAction("muteNotifications")}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white text-base flex items-center gap-3"
              >
                <span className="size-5 flex items-center justify-center">🔕</span>
                Mute Notifications
              </button>

              <button
                onClick={() => handleMenuAction("clearChat")}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white text-base flex items-center gap-3"
              >
                <span className="size-5 flex items-center justify-center">🗑️</span>
                Clear Chat
              </button>

              <button
                onClick={() => handleMenuAction("deleteChat")}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 text-base flex items-center gap-3"
              >
                <span className="size-5 flex items-center justify-center">❌</span>
                Delete Chat
              </button>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>

              <button
                onClick={() => handleMenuAction("blockUser")}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 text-base flex items-center gap-3"
              >
                <span className="size-5 flex items-center justify-center">🚫</span>
                Block User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}