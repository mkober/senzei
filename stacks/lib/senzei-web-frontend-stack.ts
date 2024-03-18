import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';

import * as acmpca from 'aws-cdk-lib/aws-acmpca';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';

import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cm from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

import { ConfigProps } from './config';

import { Construct } from 'constructs';

type SenzeiWebFrontEndStackProps = cdk.StackProps & {
  config: Readonly<ConfigProps>
}

export class SenzeiWebFrontEndStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SenzeiWebFrontEndStackProps) {
    super(scope, id, props);

    const path = require('node:path');

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'CloudFront-OAI', {
      comment: `OAI for ${id}`
    });

    const webBucket = new s3.Bucket(this, 'WebBucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
    });

    webBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [webBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));
    new CfnOutput(this, 'Bucket: ', { value: webBucket.bucketName });
    
    //const certificateArn = 'arn:aws:acm:us-east-1:384220398932:certificate/7380e3e1-61ad-4f30-9b30-c0ad2a751fc6';

    /*
    const domainZone = route53.HostedZone.fromLookup(this, 'Domain', {
      domainName: props.config.DOMAIN 
    });

    const certificate = new cm.Certificate(this, 'Certificate', {
      domainName: props.config.DOMAIN,
      validation: cm.CertificateValidation.fromDns(domainZone),
      subjectAlternativeNames: [props.config.DOMAIN_WILDCARD]
    });
    */

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'WebDistribution', {
      defaultRootObject: "index.html",
      /*
      domainNames: [props.config.DOMAIN],
      certificate: certificate,
      */
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses:[
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: '/error.html',
          ttl: Duration.minutes(30),
        }
      ],
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(webBucket, {originAccessIdentity: cloudfrontOAI}),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    })

    new CfnOutput(this, 'DistributionId: ', { value: distribution.distributionId });
    new CfnOutput(this, 'DistributionWebId: ', { value: distribution.distributionDomainName });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../web/frontend/out'))],
      destinationBucket: webBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
