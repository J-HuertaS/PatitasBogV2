import { responseService } from "../../services/responseService";
import { useState } from "react";
const CreateResponse = () => {
  const [response, setResponse] = useState(null);
  const report_id = "684707edaeeb517258906a30";
  const responseObj = {
    type: "avistamiento",
    comment: "Lo vi cerca del parque",
    images: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
    location: {
      type: "Point",
      coordinates: [-74.03, 4.67],
    },
  };
  responseService
    .createResponse(report_id, responseObj)
    .then((res) => {
      console.log("Response created successfully:", res);
      setResponse(res);
    })
    .catch((error) => {
      console.error("Error creating response:", error);
    });
  return (
    <div>
      <h1>Create Response Test</h1>
      {response ? (
        <div>
          <h2>Response Created Successfully</h2>
          <p>ID: {response._id}</p>
          <p>Type: {response.type}</p>
          <p>Comment: {response.comment}</p>
          <p>Images: {response.images.join(", ")}</p>
          <p>Location: {JSON.stringify(response.location)}</p>
        </div>
      ) : (
        <p>Creating response...</p>
      )}
    </div>
  );
};

export default CreateResponse;
