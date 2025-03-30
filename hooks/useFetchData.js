import { useState, useEffect } from "react";
import axios from "axios";

function useFetchData(apiEndPoint) {
  const [alldata, setalldata] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setloading(true);
        const res = await axios.get(apiEndPoint);
        setalldata(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setloading(false);
      }
    };

    if (apiEndPoint) {
      fetchAllData();
    }
  }, [apiEndPoint]);

  return { alldata, loading };
}

export default useFetchData;
