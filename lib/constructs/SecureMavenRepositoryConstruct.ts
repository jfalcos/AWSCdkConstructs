import { CfnOutput } from "aws-cdk-lib";
import { Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  ObjectOwnership,
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
      versioned: false,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
    });

    // Create a CloudFront distribution
    this.distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    // Output the CloudFront distribution domain name
    new CfnOutput(this, "DistributionDomainName", {
      value: this.distribution.distributionDomainName,
    });
  }
}
