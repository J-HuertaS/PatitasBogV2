import { useEffect, useState } from "react";
import { reportService } from "../../services/reportService";

const AllReports = () => {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    reportService
      .getAllReports()
      .then((response) => {
        setReports(response);
        console.log("Reports fetched successfully:", reports);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  return (
    <div>
      {reports.map((report) => (
        <div key={report.id}>
          <h2>{report.type}</h2>
          <p>{report.description}</p>
          <p>Status: {report.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AllReports;
