import React from "react";
import axios from "axios";
import { setPatient, useStateValue } from "../state";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import DiagnosisList from "../components/DiagnosisList";
import AddEntryForm, { EntryFormValues } from "./AddEntryForm";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const GenderIcon = ({ gender }: { gender: string }) => {
  switch (gender) {
    case "male":
      return (
        <span>
          <MaleIcon />
        </span>
      );
    case "female":
      return (
        <span>
          <FemaleIcon />
        </span>
      );
    case "other":
      return (
        <span>
          <TransgenderIcon />
        </span>
      );
  }
  return <></>;
};

const PatientPage = () => {
  const [{ patient }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    console.log("patient in state:", patient);

    const fetchPatient = async () => {
      try {
        if (id) {
          const { data: fetchedPatient } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          console.log("fetchedPatient", fetchedPatient);
          if (fetchedPatient) {
            dispatch(setPatient(fetchedPatient));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!patient || patient.id !== id) {
      void fetchPatient();
    }
  }, [dispatch]);

  const onSubmitNewEntry = async (values: EntryFormValues) => {
    console.log(values);
    try {
      if (id) {
        const { data: updatedPatient} = await axios.post<Patient>(
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        console.log("upd:" ,updatedPatient);
        dispatch(setPatient(updatedPatient));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (patient) {
    return (
      <div>
        <h2>
          {patient.name} <GenderIcon gender={patient.gender} />
        </h2>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        <p>
          <b>Entries</b>
        </p>
        <AddEntryForm onSubmit={onSubmitNewEntry} />
        {patient.entries.map((entry) => {
          switch (entry.type) {
            case "Hospital":
              return (
                <div key={entry.id}>
                  <p>{entry.description}</p>
                  <DiagnosisList data={entry.diagnosisCodes} />
                  <hr></hr>
                </div>
              );
            case "HealthCheck":
              return (
                <div key={entry.id}>
                  <p>
                    <i>{entry.date}</i> {entry.description}
                  </p>
                  <DiagnosisList data={entry.diagnosisCodes} />
                  <hr></hr>
                </div>
              );
            case "OccupationalHealthcare":
              return (
                <div key={entry.id}>
                  <p>
                    <i>{entry.date}</i> {entry.description}
                  </p>
                  <DiagnosisList data={entry.diagnosisCodes} />
                  <hr></hr>
                </div>
              );
            default:
              return assertNever(entry);
          }
        })}
      </div>
    );
  }

  return <div>No patient found</div>;
};

export default PatientPage;
