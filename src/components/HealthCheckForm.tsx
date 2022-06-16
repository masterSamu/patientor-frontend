import {
  Grid,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
//import React, { useState } from "react";
import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { Diagnosis, HealthCheckEntry, HealthCheckRating } from "../types";

export type EntryHealthCheckForm = Omit<HealthCheckEntry, "id">;

interface Props {
  onSubmit: (values: EntryHealthCheckForm) => void;
  diagnosis: Diagnosis[];
}

const HealthCheckForm = ({ onSubmit, diagnosis }: Props) => {

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: "HealthCheck",
        healthCheckRating: HealthCheckRating.Healthy,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.diagnosisCodes) {
          errors.diagnosisCodes = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
        return errors;
      }}
    >
      {({ values, isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Type"
              placeholder="Type"
              name="type"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="yyyy-mm-dd"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnosis)}
            />
            <RadioGroup
              value={values.healthCheckRating}
              name="healthCheckRating"
              onChange={(event) =>
                setFieldValue("healthCheckRating", Number(event.target.value))
              }
              aria-labelledby="healtch-check-rating"
            >
              <FormLabel>Health check rating</FormLabel>
              <FormControlLabel
                value={HealthCheckRating.Healthy}
                control={<Radio />}
                label={"Healthy"}
              />
              <FormControlLabel
                value={HealthCheckRating.LowRisk}
                control={<Radio />}
                label={"Low Risk"}
              />
              <FormControlLabel
                value={HealthCheckRating.HighRisk}
                control={<Radio />}
                label={"High Risk"}
              />
              <FormControlLabel
                value={HealthCheckRating.CriticalRisk}
                control={<Radio />}
                label={"Critical Risk"}
              />
            </RadioGroup>
            <Grid>
              <Grid item>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!dirty || !isValid}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default HealthCheckForm;
