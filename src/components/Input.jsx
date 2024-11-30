import { TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

/**
 * @typedef {import("@mantine/core").TextInputProps} TextInputProps
 */

/**
 * Custom Input component
 * @param {TextInputProps & { title: string }} props - Props for the component
 */
export default function Input({
  value = "",
  onChange,
  title,
  error,
  name,
  props = { required: false },
  ...rest
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="relative w-full mt-4">
      <TextInput
        label={title}
        name={name}
        value={value}
        error={error}
        onChange={onChange}
        autoComplete="off"
        classNames={{
          input: `w-full px-3 pt-4 pb-2 text-sm border rounded-md ${isArabic ? "text-right" : "text-left"
            }`,
          label: "!text-xs",
        }}
        {...rest}
      />
    </div>
  );
}
