import { useRouter } from "next/navigation";
import React, { useState } from "react";

// React Icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Styled
import { InputStyled } from "../BaseStyle/styled";

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
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <InputStyled
      mb={mb}
      preInputText={preInputText}
      postInputText={postInputText}
      lowercase={lowercase}
      disabled={disabled}
    >
      {label && <label id={id}>{label}</label>}
      <div
        className={`input-container rounded-full bg-white shadow-md  ${
          error ? "border-error" : ""
        } `}
        tabIndex={1}
      >
        {icon && <span className="px-3 text-gray-500">{icon}</span>}
        {onChange && (
          <input
            type={type === "password" && passwordVisible ? "text" : type}
            id={id}
            className={`input text-gray-900 py-3 pr-3 ${inputClass}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
            disabled={disabled}
            {...props}
          />
        )}
        {type === "password" && (
          <>
            {!passwordVisible ? (
              <span
                className="absolute right-[23px] top-1/2 -translate-y-1/2 w-5 flex items-center justify-center text-[#B8B8B8] cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <AiOutlineEyeInvisible fontSize={23} />
              </span>
            ) : (
              <span
                className="absolute right-[23px] top-1/2 -translate-y-1/2 w-5 flex items-center justify-center text-[#B8B8B8] cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <AiOutlineEye fontSize={23} />
              </span>
            )}
          </>
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
        )}{" "}
      </div>
      {!helperText && error && typeof error === "string" && (
        <p className="error ">{error}</p>
      )}
      {helperText && <p className="mt-2 text-xs text-gray-800">{helperText}</p>}
    </InputStyled>
  );
};

export default Input;
