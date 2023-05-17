import { FC } from "react";
import emojiData from "emojilib";

interface EmojiPickerProps {
  handleEmojiClick: (emoji:string) => void
}

const CustomEmojiPicker: FC<EmojiPickerProps> = ({ handleEmojiClick }) => {

  return (
    <div className="max-h-[100px] overflow-y-auto">
      <div className="flex flex-wrap items-center bg-gray-50 p-4">
        {Object.keys(emojiData).map((emoji: any) => (
          <span
            key={emoji}
            onClick={() => handleEmojiClick(emoji)}
            className="text-xl font-sans p-2 cursor-pointer"
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CustomEmojiPicker;

