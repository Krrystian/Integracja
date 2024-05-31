import React, { useState } from "react";
interface InputProps {
  placeholder: string;
  type?: string;
}
const Input: React.FC<InputProps> = ({ placeholder, type }) => {
  const [onFocus, setOnFocus] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="relative">
      {type === "textarea" ? (
        <textarea
          name={placeholder}
          id={placeholder}
          className="resize-none focus:outline-none py-1 text-xl w-full"
          rows={6}
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
          onChange={(e) => setValue(e.target.value)}
          required
          autoComplete="input"
        />
      ) : (
        <input
          type={type ? type : "text"}
          name={placeholder}
          id={placeholder}
          className="text-xl focus:outline-none py-2 w-full"
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
          onChange={(e) => setValue(e.target.value)}
          required
          autoComplete="input"
        />
      )}
      <span className="absolute bottom-0 h-1 left-0 w-full bg-black" />
      <span
        className={`absolute bottom-0 h-1 left-0 w-full ${
          onFocus ? "scale-x-100" : "scale-x-0"
        } bg-green-500 transform origin-center transition-transform duration-500`}
      />
      <label
        htmlFor={placeholder}
        className={`text-xl absolute left-0 text-black/60 cursor-text duration-300 transition-all ${
          (onFocus || value) && "-translate-y-4 text-base"
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};
export default Input;
