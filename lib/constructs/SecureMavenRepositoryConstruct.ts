import { CfnOutput } from "aws-cdk-lib";
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface MavenRepositoryProps {
  readonly bucketName?: string;
}

export class SecureMavenRepositoryConstruct extends Construct {
  public readonly distribution: Distribution;
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props: MavenRepositoryProps = {}) {
    super(scope, id);

    // Create an S3 bucket
    this.bucket = new Bucket(this, "MavenArtifactsBucket", {
      bucketName: props.bucketName,
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    // Create an Origin Access Identity for CloudFront
    const oai = new OriginAccessIdentity(this, "OAI", {
      comment: `OAI for ${this.bucket.bucketName}`,
    });

    // Create a CloudFront distribution
    this.distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new S3Origin(this.bucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    // Output the CloudFront distribution domain name
    new CfnOutput(this, "DistributionDomainName", {
      value: this.distribution.distributionDomainName,
    });
  }
}
