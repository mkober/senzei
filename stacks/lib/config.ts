import * as dotenv from "dotenv";

import path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

export type ConfigProps = {
  REGION: string,
  DOMAIN: string,
  DOMAIN_ALT: string,
  DOMAIN_WILDCARD: string,
  DOMAIN_ACCOUNT: string,
  DEPLOY_ACCOUNT: string,
  DEPLOY_DOMAIN: string,
  DEPLOY_DISTRIBUTION_ID: string,
  DEPLOY_DISTRIBUTION_WEB: string,
};

export const getConfig = (): ConfigProps => ({
  REGION: process.env.REGION || "us-east-1",
  DEPLOY_ACCOUNT: process.env.DEPLOY_ACCOUNT || "",
  DEPLOY_DOMAIN: process.env.DOMAIN || "",
  DEPLOY_DISTRIBUTION_ID: process.env.DEPLOY_DISTRIBUTION_ID || "",
  DEPLOY_DISTRIBUTION_WEB: process.env.DEPLOY_DISTRIBUTION_WEB || "",
  DOMAIN: process.env.DOMAIN || "",
  DOMAIN_ALT: process.env.DOMAIN_ALT || "",
  DOMAIN_WILDCARD: process.env.DOMAIN_WILDCARD || "",
  DOMAIN_ACCOUNT: process.env.DOMAIN_ACCOUNT || "",
});
