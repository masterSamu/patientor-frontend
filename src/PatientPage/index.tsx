import React from "react";
import axios from "axios";
import { setPatient, useStateValue } from "../state";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";

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
          {patient.name} {patient.gender}
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
          }
        })}
      </div>
    );
  }

  return <div>No patient found</div>;
};

interface DiagnosisCodeListProps {
  data: Array<string> | undefined;
}

const DiagnosisCodeList = ({ data }: DiagnosisCodeListProps) => {
  return (
    <ul>
      {data?.map((code) => {
        return <li key={code}>{code}</li>;
      })}
    </ul>
  );
};

export default PatientPage;
