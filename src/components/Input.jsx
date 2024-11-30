import { useState } from "react";
import { TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function Input({ value = "", onChange, title, error, name }) {
  const { t, i18n } = useTranslation();
  const [focused, setFocused] = useState(false);
  const floating = value.trim().length !== 0 || focused;

  // Check if the current language is Arabic
  const isArabic = i18n.language === "ar";

  return (
    <div className="relative w-full mt-4">
      <TextInput
        label={title}
        placeholder={`${t('enter')} ${title}`}
        required
        name={name}
        value={value}
        onChange={(event) => onChange(event)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        classNames={{
          root: "relative",
          input: `w-full px-3 pt-4 pb-2 text-sm border rounded-md focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
            floating ? "placeholder-gray-400" : "placeholder-transparent"
          } ${isArabic ? 'text-right' : 'text-left'}`, // Conditionally align text based on language
          label: `absolute ${isArabic ? 'right-3' : 'left-3'} top-2.5 text-gray-500 transition-all duration-150 ease-in-out pointer-events-none ${
            floating ? "text-xs top-[-1.12rem] font-medium text-gray-800" : ""
          }`, // Change position of the label for Arabic
        }}
        labelProps={{ "data-floating": floating }}
      />
      {error && (
        <span style={{ color: "red", fontSize: "12px", paddingLeft: "8px" }}>
          {error}
        </span>
      )}
    </div>
  );
}
