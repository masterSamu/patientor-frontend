import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { useStateValue } from "../state";

import HospitalForm, { EntryHospitalForm } from "../components/HospitalForm";
import HealthCheckForm, { EntryHealthCheckForm } from "../components/HealthCheckForm";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
}

export type EntryFormValues = EntryHealthCheckForm | EntryHospitalForm;

export type FormType = "Hospital" | "HealthCheck" | "OccupationalHealthcare";

const types = ["Hospital", "HealthCheck", "OccupationalHealthcare"];

const AddEntryForm = ({ onSubmit }: Props) => {
  const [{ diagnosis }] = useStateValue();
  const [selectedType, setType] = useState<FormType>("Hospital");

  const handleTypeSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value === "Hospital") setType(value);
    if (value === "HealthCheck") setType(value);
    if (value === "OccupationalHealthcare") setType(value);
  };

  return (
    <>
      <Formik
        initialValues={{ type: "" }}
        onSubmit={() => console.log("submit")}
      >
        <Form>
          <Field
            as="select"
            name="type"
            onChange={handleTypeSelection}
            value={selectedType}
          >
            {types.map((type, index) => {
              return (
                <option value={type} key={index}>
                  {type}
                </option>
              );
            })}
          </Field>
        </Form>
      </Formik>
      {selectedType === "Hospital" && (
        <HospitalForm onSubmit={onSubmit} diagnosis={diagnosis} />
      )}
      {selectedType === "HealthCheck" && (
        <HealthCheckForm onSubmit={onSubmit} diagnosis={diagnosis} />
      )}
    </>
  );
};

export default AddEntryForm;
