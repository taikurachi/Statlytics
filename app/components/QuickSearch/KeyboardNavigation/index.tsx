import Icon from "../../utils/Icon";
export default function KeyboardNavigation({
  isTyping,
}: {
  isTyping: boolean;
}) {
  return (
    isTyping && (
      <div className="flex justify-between px-8 pb-4">
        <div className="flex items-center">
          <div className="py-2 px-[10px] border border-white rounded-md">
            <Icon variant="arrow" size={12} />
          </div>
          <div className="py-2 px-[10px] border border-white rounded-md ml-2">
            <Icon variant="arrow" className="rotate-180" size={12} />
          </div>
          <span className="ml-3 opacity-80">Navigate</span>
        </div>
        <div className="flex items-center">
          <span className="px-2 py-1 border border-white rounded-md">⌘</span>
          <span className="px-2 py-1 border border-white rounded-md ml-2">
            Enter
          </span>
          <span className="ml-3 opacity-80">Analyze</span>
        </div>
      </div>
    )
  );
}
