import status from "../statuses";
import axios from "axios";

const getData = (path, data = {}, headers) => {
  const options = {
    method: "GET",
    headers: { "content-type": "application/json", ...headers },
    url: path,
    data
  };
  return axios(options)
    .then(response => {
      if (response.status === status.OK) {
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
        data: undefined,
        error: true
      };
    })
    .catch(error => {
      return {
        status: error.response.status,
        error: true,
        success: false,
        data: error.response.data
      };
    });
};

export default getData;
