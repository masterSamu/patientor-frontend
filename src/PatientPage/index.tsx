import React, { useEffect } from "react";
import axios from "axios";
import { setDiagnosis, setPatient, useStateValue } from "../state";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { Diagnosis, Patient } from "../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

interface DiagnosisCodeListProps {
  data: Array<string> | undefined;
}

const DiagnosisCodeList = ({ data }: DiagnosisCodeListProps) => {
  const [{ diagnosis }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const { data: fetchedDiagnoses } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        console.log(fetchedDiagnoses);
        if (fetchedDiagnoses) {
          dispatch(setDiagnosis(fetchedDiagnoses));
        }
      } catch (error) {
        console.error(error);
      }
    };
    void fetchDiagnosis();
  }, [dispatch]);
  return (
    <ul>
      {data?.map((code) => {
        return (
          <li key={code}>
            {code}{" "}
            <span>
              {diagnosis.find((diagnose) => diagnose.code === code)?.name}
            </span>
            ;
          </li>
        );
      })}
    </ul>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const GenderIcon = ({gender}: {gender: string}) => {
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
        {patient.entries.map((entry) => {
          switch (entry.type) {
            case "Hospital":
              return (
                <div key={entry.id}>
                  <p>{entry.description}</p>
                  <DiagnosisCodeList data={entry.diagnosisCodes} />
                </div>
              );
            case "HealthCheck":
              return (
                <div key={entry.id}>
                  <p>
                    {entry.date} {entry.description}
                  </p>
                  <DiagnosisCodeList data={entry.diagnosisCodes} />
                </div>
              );
            case "OccupationalHealthcare":
              return (
                <div key={entry.id}>
                  <p>
                    {entry.date} {entry.description}
                  </p>
                  <DiagnosisCodeList data={entry.diagnosisCodes} />
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
