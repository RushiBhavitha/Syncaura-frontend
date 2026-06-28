export default function MessageBubble({ text, isOwn }) {
  return (
    <div className={`flex mb-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
          isOwn
            ? "bg-[#2457C5] dark:bg-[#73FBFD] dark:text-[#000000] text-[#FFFFFF] rounded-br-sm"
            : "dark:bg-[#424242] bg-[#FFFFFF] text-[#000000] dark:text-[#FFFFFF] rounded-bl-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}