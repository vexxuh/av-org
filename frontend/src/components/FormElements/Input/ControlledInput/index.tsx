import { useRouter } from "next/navigation";
import React, { useState } from "react";

// React Icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Styled

// Types
import { InputBaseProps } from "../BaseTypes";

type InputProps = InputBaseProps & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
};

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  label,
  type = "text",
  mb = 24,
  preInputText,
  postInputText,
  error,
  required,
  helperText,
  lowercase,
  value,
  onChange,
  inputClass,
  disabled,
  icon,
  rounded = "rounded-full",
  border = "",
  parentStyles = "",
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div
      className={`${parentStyles} ${rounded} mb-${mb} text-gray-500 overflow-hidden`}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={`shadow-md flex items-center w-full overflow-hidden ${
          error ? "border-error" : ""
        } ${border}`}
      >
        {icon && <span className="px-3 flex items-center">{icon}</span>}
        {onChange && (
          <input
            type={type === "password" && passwordVisible ? "text" : type}
            id={id}
            className={`text-gray-900 py-3 px-3 w-full outline-none ${inputClass}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
            disabled={disabled}
            {...props}
          />
        )}
        {type === "password" && (
          <span
            className="absolute right-[23px] top-1/2 -translate-y-1/2 w-5 flex items-center justify-center text-[#B8B8B8] cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <AiOutlineEye fontSize={23} />
            ) : (
              <AiOutlineEyeInvisible fontSize={23} />
            )}
          </span>
        )}
        {preInputText && (
          <span className="pre-input-text text-small-normal-gray">
            {preInputText}
          </span>
        )}
        {postInputText && (
          <span className="post-input-text text-small-normal-gray">
            {postInputText}
          </span>
        )}
      </div>
      {!helperText && error && typeof error === "string" && (
        <p className="error">{error}</p>
      )}
      {helperText && <p className="mt-2 text-xs text-gray-800">{helperText}</p>}
    </div>
  );
};

export default Input;
