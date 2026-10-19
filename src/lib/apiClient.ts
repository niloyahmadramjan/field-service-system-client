
import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not configured in .env.local",
  );
}

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

export default apiClient;
