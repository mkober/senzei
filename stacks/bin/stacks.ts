#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SenzeiWebFrontEndStack } from '../lib/senzei-web-frontend-stack';
import { getConfig } from "../lib/config";

const config = getConfig();

const app = new cdk.App();

new SenzeiWebFrontEndStack(app, 'SenzioWebFrontEndStack', {
  env: {
    region: config.REGION,
    account: config.ACCOUNT
  },
  config
});
