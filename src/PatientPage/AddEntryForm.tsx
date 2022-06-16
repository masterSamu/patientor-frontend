import React, { useState } from "react";
import { useStateValue } from "../state";

import HospitalForm, { EntryHospitalForm } from "../components/HospitalForm";
import HealthCheckForm, {
  EntryHealthCheckForm,
} from "../components/HealthCheckForm";
import OccupationalHealthcare, {
  EntryOccupationalHealthcareForm,
} from "../components/OccupationalHealthcare";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
}

export type EntryFormValues =
  | EntryHealthCheckForm
  | EntryHospitalForm
  | EntryOccupationalHealthcareForm;

export type FormType = "Hospital" | "HealthCheck" | "OccupationalHealthcare";

const types = ["Hospital", "HealthCheck", "OccupationalHealthcare"];

const AddEntryForm = ({ onSubmit }: Props) => {
  const [{ diagnosis }] = useStateValue();
  const [selectedType, setType] = useState<FormType>("Hospital");

  const handleTypeSelection = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value;
    if (value === "Hospital") setType(value);
    if (value === "HealthCheck") setType(value);
    if (value === "OccupationalHealthcare") setType(value);
  };

  return (
    <>
      <FormControl>
        <InputLabel>Type</InputLabel>
        <Select
          value={selectedType}
          label="Type"
          onChange={handleTypeSelection}
        >
          {types.map((type, index) => {
            return (
              <MenuItem value={type} key={index}>
                {type}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {selectedType === "Hospital" && (
        <HospitalForm
          onSubmit={onSubmit}
          diagnosis={diagnosis}
          type={selectedType}
        />
      )}

      {selectedType === "HealthCheck" && (
        <HealthCheckForm
          onSubmit={onSubmit}
          diagnosis={diagnosis}
          type={selectedType}
        />
      )}

      {selectedType === "OccupationalHealthcare" && (
        <OccupationalHealthcare
          onSubmit={onSubmit}
          diagnosis={diagnosis}
          type={selectedType}
        />
      )}
    </>
  );
};

export default AddEntryForm;
