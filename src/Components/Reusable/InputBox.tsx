import React from "react";

interface InputBoxProps {
  id: string;
  value?: string;
  type: string;
  placeholder: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
  className?: string; // Optional className prop
  otherProps?: Object;
}

export const InputBox: React.FC<InputBoxProps> = ({
  id,
  value,
  type,
  placeholder,
  isDisabled,
  onChange,
  className = "",
  otherProps = {},
}) => {
  return (
    <input
      id={id}
      className={`auth-input ${className}`} // Apply custom class names
      value={value}
      type={type}
      placeholder={placeholder}
      disabled={isDisabled}
      onChange={(e) => onChange(e.target.value)}
      {...otherProps}
    />
  );
};
