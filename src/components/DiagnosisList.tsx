import axios from "axios";
import { useEffect } from "react";
import { apiBaseUrl } from "../constants";
import { useStateValue, setDiagnosis } from "../state";
import { Diagnosis } from "../types";

interface Props {
  data: Array<string> | undefined;
}

const DiagnosisList = ({ data }: Props) => {
  const [{ diagnosis }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const { data: fetchedDiagnoses } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        if (fetchedDiagnoses) {
          dispatch(setDiagnosis(fetchedDiagnoses));
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (diagnosis.length === 0) {
      void fetchDiagnosis();
    }
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

export default DiagnosisList;
