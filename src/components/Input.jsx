import { useState } from "react";
import { TextInput } from "@mantine/core";

export default function Input({ value, onChange, title }) {
  const [focused, setFocused] = useState(false);
  const floating = value.trim().length !== 0 || focused;

  return (
    <div className="relative w-full mt-4">
      <TextInput
        label={title}
        placeholder={`Enter ${title}`}
        required
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        classNames={{
          root: "relative",
          input: `w-full px-3 pt-4 pb-2 text-sm border rounded-md focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
            floating ? "placeholder-gray-400" : "placeholder-transparent"
          }`,
          label: `absolute left-3 top-2.5 text-gray-500 transition-all duration-150 ease-in-out pointer-events-none ${
            floating ? "text-xs top-[-1.12rem] font-medium text-gray-800" : ""
          }`,
        }}
        labelProps={{ "data-floating": floating }}
      />
    </div>
  );
}
