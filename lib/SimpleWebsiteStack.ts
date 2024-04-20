import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { SimpleWebsiteConstruct } from "./constructs/SimpleWebsiteConstruct";

export class SimpleWebsiteTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new SimpleWebsiteConstruct(this, "SimpleWebsiteConstruct", {
      bucketName: "replace",
      domainNames: ["replace"],
      prefixForId: "replace",
      hostedZoneId: "replace",
      terminationProtection: false,
      isSinglePageApplication: true,
    });
  }
}
