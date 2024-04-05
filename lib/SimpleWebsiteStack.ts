import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SimpleWebsiteConstruct } from "./constructs/SimpleWebsiteConstruct";

export class CdkSimpleWebsiteTemplateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new SimpleWebsiteConstruct(this, "SimpleWebsiteConstruct", {
      bucketName: "jfalco-test-simple-website-bucket",
      domainName: "api.jfalco.net",
      prefixForId: "jfalcoTest",
      hostedZoneId: "Z05061913FQYPH06UR3W",
      terminationProtection: false,
    });
  }
}
