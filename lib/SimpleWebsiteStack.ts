import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SimpleWebsiteConstruct } from "./constructs/SimpleWebsiteConstruct";

export class CdkSimpleWebsiteTemplateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new SimpleWebsiteConstruct(this, "SimpleWebsiteConstruct", {
      bucketName: "replace",
      domainName: "replace",
      prefixForId: "replace",
      hostedZoneId: "replace",
      terminationProtection: true,
    });
  }
}
