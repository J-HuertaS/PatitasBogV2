import { useEffect, useState } from "react";
import { reportService } from "../../services/reportService";

const OneReport = ({ report_id }) => {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    reportService
      .getReportById(report_id)
      .then((response) => {
        setReports(response);
        console.log("Reports fetched successfully:", reports);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  console.log("Reports state:", reports);
  return (
    <div>
      <div key={reports.id}>
        <h2>{reports.type}</h2>
        <p>{reports.description}</p>
        <p>Status: {reports.status}</p>
        <p>report id: {reports._id}</p>
        <p>user_id: {reports.user_id}</p>
        <p>images: {reports.images}</p>
      </div>
      <h3>Complete object</h3>
    </div>
  );
};
export default OneReport;
