import React from "react";
import axios from "axios";
import { useStateValue } from "../state";
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
            dispatch({ type: "SET_PATIENT", payload: fetchedPatient });
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
        <h2>{patient.name}</h2>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
      </div>
    );
  }
  
  return <div>No patient found</div>;
};

export default PatientPage;
