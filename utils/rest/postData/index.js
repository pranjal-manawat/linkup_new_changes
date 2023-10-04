import status from "../statuses";
import axios from "axios";

const postData = (path, data, headers) => {
  const options = {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    url: path,
    data
  };
  return axios(options)
    .then(response => {
      if (response.status === status.CREATED || response.status === status.OK) {
        return {
          status: response.status,
          success: true,
          error: false,
          data: response.data
        };
      }
      return {
        status: response.status,
        success: false,
        data: null,
        error: response.error
      };
    })
    .catch(error => {
      return {
        statusCode: error.response.status,
        error: error.response.data,
        success: false,
        data: error.response.data
      };
    });
};

export default postData;
