import { FC } from "react";

interface TypingIndicatorProps {
  friendName: string;
}

const TypingIndicator: FC<TypingIndicatorProps> = ({
  friendName,
}: TypingIndicatorProps) => {
  return friendName ? (
    <div className="mt-5 rounded-sm p-3 overflow-x-auto">
      <div className="w-full p-4">{friendName} is typing...</div>
    </div>
  ) : null;
};

export default TypingIndicator;
