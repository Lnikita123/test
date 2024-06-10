interface Environments {
  [key: string]: string;
}

const environments: Environments = {
  local: "https://staging.api.playalvis.com",
  staging: "https://staging.api.playalvis.com",
};

const currentEnvironment: string = process.env.REACT_APP_ENV || "local";

export const API_BASE_URL: string = environments[currentEnvironment];
