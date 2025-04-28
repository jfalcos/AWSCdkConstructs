import { CloudFrontToS3 } from "@aws-solutions-constructs/aws-cloudfront-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface SimpleWebsiteConstructProps {
  domainNames: string[]; // Change domainName to domainNames array
  bucketName: string;
  prefixForId: string;
  hostedZoneId: string;
  terminationProtection?: boolean;
  isSinglePageApplication?: boolean;
}

export class SimpleWebsiteConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: SimpleWebsiteConstructProps
  ) {
    super(scope, id);

    const hostedZone = HostedZone.fromHostedZoneId(
      this,
      `${props.prefixForId}SimpleWebsiteConstructHostedZone`,
      props.hostedZoneId
    );

    const certificate = this.createIAMCertificate(
      props.domainNames,
      props.prefixForId,
      hostedZone
    );

    const bucket = this.createS3Bucket(
      props.bucketName,
      props.prefixForId,
      props.terminationProtection
    );

    const distribution = this.createCloudFrontDistribution(
      bucket,
      props.prefixForId,
      certificate,
      props.domainNames,
      props.isSinglePageApplication
    );
  }

  private createIAMCertificate(
    domainNames: string[],
    prefixForId: string,
    hostedZone: IHostedZone
  ): Certificate {
    return new Certificate(this, `${prefixForId}Certificate`, {
      domainName: domainNames[0], // Use the first domain name in the array
      subjectAlternativeNames: domainNames.slice(1), // Use the remaining domain names as subject alternative names
      validation: CertificateValidation.fromDns(hostedZone),
    });
  }

  private createS3Bucket(
    bucketName: string,
    prefixForId: string,
    terminationProtection?: boolean
  ): Bucket {
    const bucket = new Bucket(this, `${prefixForId}Bucket`, {
      bucketName: bucketName,
      removalPolicy: terminationProtection
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY,
    });

    return bucket;
  }

  private createCloudFrontDistribution(
    bucket: Bucket,
    prefixForId: string,
    certificate: Certificate,
    domainNames: string[],
    isSinglePageApplication?: boolean
  ): Distribution {
    const cloudFrontToS3 = new CloudFrontToS3(
      this,
      `${prefixForId}CloudFrontToS3`,
      {
        existingBucketObj: bucket,
        logS3AccessLogs: false,
        cloudFrontDistributionProps: {
          OriginAccessIdentity: "oac",
          certificate: certificate,
          domainNames: domainNames,
          insertHttpSecurityHeaders: false,
          errorResponses: isSinglePageApplication
            ? [
                {
                  httpStatus: 404,
                  responseHttpStatus: 200,
                  responsePagePath: "/index.html",
                },
                {
                  httpStatus: 403,
                  responseHttpStatus: 200,
                  responsePagePath: "/index.html",
                },
              ]
            : undefined,
        },
        cloudFrontLoggingBucketProps: {},
      }
    );
    return cloudFrontToS3.cloudFrontWebDistribution;
  }
}
