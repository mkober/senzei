import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';

import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

import { ConfigProps } from './config';

import { Construct } from 'constructs';

type SenzeiWebDomainStackProps = cdk.StackProps & {
  config: Readonly<ConfigProps>
}

export class SenzeiWebDomainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SenzeiWebDomainStackProps) {
    super(scope, id, props);

    const domainZone = route53.HostedZone.fromLookup(this, 'Domain', {
      domainName: props.config.DOMAIN 
    });
    
    // Certificate
    const certificate = new cm.Certificate(this, 'Certificate', {
      domainName: props.config.DOMAIN,
      validation: cm.CertificateValidation.fromDns(domainZone),
      subjectAlternativeNames: [props.config.DOMAIN_WILDCARD]
    });

    const distribution = cloudfront.Distribution.fromDistributionAttributes(this, 'WebFrontEndDistribution', {
      distributionId: props.config.DEPLOY_DISTRIBUTION_ID, 
      domainName: props.config.DEPLOY_DISTRIBUTION_WEB
    });

    // Alias Record in Account A pointing to the distribution
    new route53.ARecord(this, 'AliasRecord', {
      zone: domainZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new CfnOutput(this, 'Certificate ARN: ', { value: certificate.certificateArn });
  }
}
