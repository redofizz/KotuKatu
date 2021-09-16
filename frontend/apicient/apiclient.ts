import axios from "axios";

const apiclient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKENDBASEURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiclient
