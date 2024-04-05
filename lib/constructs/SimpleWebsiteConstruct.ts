import { RemovalPolicy } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  CachePolicy,
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface SimpleWebsiteConstructProps {
  domainName: string;
  bucketName: string;
  prefixForId: string;
  hostedZoneId: string;
  terminationProtection?: boolean; // Add terminationProtection property
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
      props.domainName,
      props.prefixForId,
      hostedZone
    );

    const bucket = this.createS3Bucket(
      props.bucketName,
      props.prefixForId,
      props.terminationProtection // Pass terminationProtection to createS3Bucket method
    );

    const distribution = this.createCloudFrontDistribution(
      bucket,
      props.prefixForId,
      certificate,
      props.domainName
    );
  }

  private createIAMCertificate(
    domainName: string,
    prefixForId: string,
    hostedZone: IHostedZone
  ): Certificate {
    return new Certificate(this, `${prefixForId}Certificate`, {
      domainName: domainName,
      validation: CertificateValidation.fromDns(hostedZone),
    });
  }

  private createS3Bucket(
    bucketName: string,
    prefixForId: string,
    terminationProtection?: boolean // Add terminationProtection parameter
  ): Bucket {
    const bucket = new Bucket(this, `${prefixForId}Bucket`, {
      bucketName: bucketName,
      removalPolicy: terminationProtection
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY, // Set removal policy based on terminationProtection
    });

    return bucket;
  }

  private createCloudFrontDistribution(
    bucket: Bucket,
    prefixForId: string,
    certificate: Certificate,
    domainName: string
  ): Distribution {
    const oai = new OriginAccessIdentity(this, `${prefixForId}OAI`);
    const distribution = new Distribution(this, `${prefixForId}Distribution`, {
      defaultBehavior: {
        origin: new S3Origin(bucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachedMethods: { methods: ["GET", "HEAD"] },
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      },
      certificate: certificate,
      domainNames: [domainName],
    });
    return distribution;
  }
}
