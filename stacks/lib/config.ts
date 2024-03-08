import * as dotenv from "dotenv";

import path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

export type ConfigProps = {
  REGION: string,
  ACCOUNT: string,
  DOMAIN: string,
  DOMAIN_ALT: string,
  DOMAIN_WILDCARD: string
};

export const getConfig = (): ConfigProps => ({
  REGION: process.env.REGION || "us-east-1",
  ACCOUNT: process.env.ACCOUNT || "",
  DOMAIN: process.env.DOMAIN || "",
  DOMAIN_ALT: process.env.DOMAIN_ALT || "",
  DOMAIN_WILDCARD: process.env.DOMAIN_WILDCARD || ""
});
