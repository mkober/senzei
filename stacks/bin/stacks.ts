#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';
import { SenzeiWebDomainStack } from '../lib/senzei-web-domain-stack';
import { SenzeiWebFrontEndStack } from '../lib/senzei-web-frontend-stack';
import { getConfig } from "../lib/config";

const config = getConfig();

const app = new cdk.App();

new SenzeiWebDomainStack(app, 'SenzeiWebDomainStack', {
  env: {
    region: config.REGION,
    account: config.DOMAIN_ACCOUNT
  },
  config
});

new SenzeiWebFrontEndStack(app, 'SenzeiWebFrontEndStack', {
  env: {
    region: config.REGION,
    account: config.DEPLOY_ACCOUNT
  },
  config
});
