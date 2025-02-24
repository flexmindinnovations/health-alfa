import {
  TextInput,
  Textarea,
  Select,
  Button,
  Card,
  Loader,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { openNotificationWithSound } from "@config/Notifications";
import useHttp from "@hooks/AxiosInstance.jsx";
import { Trash2 } from "lucide-react";
import { useApiConfig } from "@contexts/ApiConfigContext";

export function AppointmentDetails({ data }) {
  const [rows, setRows] = useState([
    { medicineId: null, dosage: null, quantity: "" },
  ]);
  const [searches, setSearches] = useState({});
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const { apiConfig } = useApiConfig();
  const http = useHttp();
  const [diagnosis, setDiagnosis] = useState("");
  const [doctorSuggestion, setDoctorSuggestion] = useState("");

  const handleChange = (index, key, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const addRow = () => {
    setRows([...rows, { medicineId: null, dosage: null, quantity: "" }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
      setSearches((prev) => {
        const newSearches = { ...prev };
        delete newSearches[index];
        return newSearches;
      });
      setOptions((prev) => {
        const newOptions = { ...prev };
        delete newOptions[index];
        return newOptions;
      });
    }
  };

  const handleSearchChange = (index, value) => {
    setSearches((prev) => ({ ...prev, [index]: value }));
  };

  useEffect(() => {
    Object.keys(searches).forEach((index) => {
      if (!searches[index]) {
        setOptions((prev) => ({ ...prev, [index]: [] }));
        return;
      }
      getMedicineList(index);
    });
  }, [searches]);

  const getMedicineList = async (index) => {
    setLoading(true);
    try {
      const response = await http.get(
        apiConfig.medicine.getMedicineList(1, 10, searches[index])
      );
      if (response?.status === 200 && Array.isArray(response.data)) {
        setOptions((prev) => ({
          ...prev,
          [index]: response.data.map((med) => ({
            label: med.medicineName,
            value: String(med.medicineId),
          })),
        }));
      } else {
        setOptions((prev) => ({ ...prev, [index]: [] }));
      }
    } catch (err) {
      setOptions((prev) => ({ ...prev, [index]: [] }));
      openNotificationWithSound(
        {
          title: err.name || "Error",
          message: err.message || "Something went wrong",
          color: "red",
        },
        { withSound: false }
      );
    } finally {
      setLoading(false);
    }
  };

  const AddPrescription = async () => {
    const payload = {
      prescriptionId: 0,
      appointmentId: data?.appointmentId,
      doctorId: data?.doctorId,
      patientId: data?.patientId,
      prescriptionDate: data?.appointmentDate,
      diagnosis: diagnosis,
      medications: rows.map((row) => ({
        medicationId: 0,
        medicineId: row.medicineId ? parseInt(row.medicineId, 10) : 0,
        dosage: row.dosage || "",
        frequency: row.quantity || "",
      })),
    };
    try {
      const response = await http.post(
        apiConfig.DoctorPrescription.saveDoctorPrescription,
        payload
      );
      if (response.status === 200) {
        openNotificationWithSound(
          {
            title: "Success",
            message: response.data.message,
            color: "blue",
          },
          { withSound: true }
        );
        data?.onClose?.();
      }
    } catch (error) {
      openNotificationWithSound(
        {
          title: error.name || "Error",
          message: error.message || "An unexpected error occurred.",
          color: "red",
        },
        { withSound: false }
      );
    }
  };

  const isSaveDisabled =
    !diagnosis ||
    !doctorSuggestion ||
    rows.some((row) => !row.medicineId || !row.dosage || !row.quantity);

  return (
    <Card className="shadow-lg p-6 rounded-lg bg-gray-100 w-full max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="text-gray-700">
          <span className="font-medium">Patient Name:</span> {data?.patientName}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">Doctor Name:</span> {data?.doctorName}
        </div>
      </div>
      <div className="w-full mb-4">
        <TextInput
          label="Diagnosis"
          value={diagnosis}
          onChange={(event) => setDiagnosis(event.target.value)}
        />
      </div>
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
          >
            <Select
              label="Medicine Name"
              data={options[index] || []}
              value={row.medicineId}
              onChange={(value) => handleChange(index, "medicineId", value)}
              searchable
              searchValue={searches[index] || ""}
              onSearchChange={(value) => handleSearchChange(index, value)}
              placeholder="Search for a medicine"
              clearable
              className="w-full"
            />

            <Select
              label="Dosage"
              data={[
                { value: "morning", label: "Morning" },
                { value: "afternoon", label: "Afternoon" },
                { value: "evening", label: "Evening" },
                { value: "morningAfternoon", label: "Morning Afternoon" },
                { value: "morningEvening", label: "Morning Evening" },
                { value: "afternoonEvening", label: "Afternoon Evening" },
                { value: "morningafternoonEvening", label: "Morning Afternoon Evening" },
              ]}
              value={row.dosage}
              onChange={(value) => handleChange(index, "dosage", value)}
              searchable
              className="w-full"
            />
            <div className="flex items-end gap-2">
              <TextInput
                label="Quantity"
                value={row.quantity}
                onChange={(event) =>
                  handleChange(index, "quantity", event.target.value)
                }
                className="w-full"
              />
              {rows.length > 1 && (
                <Button
                  onClick={() => removeRow(index)}
                  variant="outline"
                  color="red"
                  size="xs"
                >
                  <Trash2 size={20} />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button
          onClick={addRow}
          variant="outline"
          color="blue"
          className="w-full"
        >
          + Add
        </Button>
        <Textarea
          label="Doctor Suggestion"
          rows={4}
          value={doctorSuggestion}
          onChange={(event) => setDoctorSuggestion(event.target.value)}
          className="w-full rounded-lg"
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          color="red"
          className="min-w-24"
          onClick={data?.onClose}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="blue"
          className="min-w-24"
          onClick={AddPrescription}
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </div>
    </Card>
  );
}