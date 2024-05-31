import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

// React Icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Styled

// Types
import { InputBaseProps } from "../BaseTypes";

const Input: React.FC<InputBaseProps> = ({
  id,
  placeholder,
  label,
  type = "text",
  mb = 0,
  preInputText,
  postInputText,
  error,
  required,
  helperText,
  lowercase,
  inputClass,
  disabled,
  button,
  maxLength,
  minLength,
  rounded = "rounded-md",
  border = "",
  ...props
}) => {
  const { register, setFocus } = useFormContext();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const activeInput = () => {
    setFocus(id);
  };
  return (
    <div
      className={`w-full`}
      style={{
        marginBottom: `${mb}px`,
      }}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={`${rounded} shadow-md flex items-center overflow-hidden relative bg-white ${
          error ? "border-error" : ""
        } ${border}`}
      >
        <input
          type={type === "password" && passwordVisible ? "text" : type}
          id={id}
          className={`text-small-normal text-gray-900 py-3 px-3 w-full outline-none ${
            inputClass || ""
          }`}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id)}
          {...props}
        />
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
        {preInputText && <span className="pre-input-text">{preInputText}</span>}
      </div>
      {(postInputText || minLength || maxLength) && (
        <span className="flex justify-end">
          {postInputText ||
            (minLength && `Min ${minLength}`) ||
            (maxLength && `Max ${maxLength}`)}
        </span>
      )}
      {!helperText && error && typeof error === "string" && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {helperText && <p className="mt-2 text-xs text-gray-800">{helperText}</p>}
      {button && <>{button}</>}
    </div>
  );
};

export default Input;
