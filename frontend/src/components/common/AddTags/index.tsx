import React from "react";

// React Icons
import { IoMdClose } from "react-icons/io";

// Components
import Input from "@/components/FormElements/Input/ControlledInput";

type AddTagsProps = {
  handleAddTags: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleRemoveTag: (tag: string) => void;
  tags: string[];
  tag: string;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  isQuickAdd?: boolean;
};

const AddTags: React.FC<AddTagsProps> = ({
  handleAddTags,
  handleRemoveTag,
  tags,
  tag,
  setTag,
  isQuickAdd,
}) => {
  return (
    <div>
      <Input
        id="tags"
        label={!isQuickAdd ? "Tags" : ""}
        required
        placeholder="Press Enter or Comma(,) key to add tag"
        mb={24}
        onKeyDown={handleAddTags}
        onChange={(e) => setTag((e.target as HTMLInputElement).value)}
        value={tag}
        rounded="rounded-md"
        border={isQuickAdd ? "border-[1px] border-[#415778]" : ""}
      />

      <div
        className={`w-full flex items-center gap-2 flex-wrap ${
          tags.length ? "block" : "hidden"
        }`}
      >
        {tags.map((tag, id) => (
          <div key={id} className="relative">
            <span className="bg-green-500 text-white font-inter text-sm py-1 px-4 rounded-full flex items-center gap-1">
              {tag}
            </span>
            <span
              className="cursor-pointer text-gray-900 absolute -top-1 -right-1 bg-stone-300 rounded-full p-[2px]"
              onClick={() => handleRemoveTag(tag)}
            >
              <IoMdClose fontSize={13} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTags;
