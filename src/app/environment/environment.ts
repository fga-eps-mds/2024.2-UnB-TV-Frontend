export const environment = {
  apiURL: process.env["API_URL"] ?? "http://localhost:8080/api",
  videoAPIURL: process.env["videoAPIURL"],
  usersAPIURL: process.env["usersAPIURL"],
  adminAPIURL: process.env["adminAPIURL"],
  EDUPLAY_CLIENT_KEY: process.env["EDUPLAY_CLIENT_KEY"] as string,
};
