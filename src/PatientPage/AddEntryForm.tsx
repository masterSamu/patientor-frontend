import { Field, Form, Formik } from "formik";
import { DiagnosisSelection } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { HospitalEntry } from "../types";
import { TextField } from "../AddPatientModal/FormField";
import { Button, Grid } from "@material-ui/core";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
}

export type EntryFormValues = Omit<HospitalEntry, "id">;

const AddEntryForm = ({ onSubmit }: Props) => {
  const [{ diagnosis }] = useStateValue();

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: "Hospital",
        discharge: { date: "", criteria: "" },
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
        if (!values.discharge.date || !values.discharge.criteria) {
          errors.discharge = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
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
            <p>Discharge</p>
            <Field
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
            />
            <Field
              label="Discharge criteria"
              placeholder="criteria"
              name="discharge.criteria"
              component={TextField}
            />
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

export default AddEntryForm;
