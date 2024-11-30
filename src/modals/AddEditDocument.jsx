import { useState, useEffect } from "react";
import ModalWrapper from "@components/Modal";
import { Stack, Container, Loader, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import Input from "@components/Input";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { Save } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const addEditDocumentSchema = z.object({
  documentNameEnglish: z.string().min(1, { message: "English name is required" }),
  documentNameArabic: z.string().min(1, { message: "Arabic name is required" }),
});

export function AddEditDocument({ data, mode = "add", handleOnClose, open }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const form = useForm({
    initialValues: {
      documentNameEnglish: "",
      documentNameArabic: "",
    },
    validate: zodResolver(addEditDocumentSchema),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const handleTranslate = async (text) => {
    try {
      const response = await axios.post(
        "https://rapid-translate-multi-traduction.p.rapidapi.com/t",
        { from: "en", to: "ar", q: text },
        {
          headers: {
            "x-rapidapi-key": "YOUR_API_KEY",
            "x-rapidapi-host": "rapid-translate-multi-traduction.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );
      form.setFieldValue("documentNameArabic", response.data.translatedText);
    } catch (error) {
      console.error("Translation error", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Form submitted:", form.values);
    // setTimeout(() => {
    //   setLoading(false);
    //   handleOnClose();
    // }, 1000);
  };

  // useEffect(() => {
  //   setTitle(mode === "edit" ? `${t("edit")} ${t("document")}` : `${t("add")} ${t("document")}`);
  //   if (mode === "edit" && data) {
  //     form.setValues({
  //       documentNameEnglish: data.documentTypeEnglish || "",
  //       documentNameArabic: data.documentTypeArabic || "",
  //     });
  //   }
  //   setLoading(false);
  // }, [mode, data, t]);

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader />
      </Container>
    );
  }

  return (
    <ModalWrapper isOpen={open} toggle={handleOnClose} title={title} size="md">
      <Stack className="flex flex-col gap-2">
        <Input
          {...form.getInputProps("documentNameEnglish")}
          title={`${t("documentName")} ${t("english")}`}
          withAsterisk
        // onBlur={(e) => handleTranslate(e.target.value)}
        />
        <Input
          {...form.getInputProps("documentNameArabic")}
          title={`${t("documentName")} ${t("arabic")}`}
          withAsterisk
        />

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            leftSection={<Save size={16} />}
            loading={loading}
            disabled={!form.isValid()}
          >
            {t("submit")}
          </Button>
        </div>
      </Stack>
    </ModalWrapper>
  );
}
