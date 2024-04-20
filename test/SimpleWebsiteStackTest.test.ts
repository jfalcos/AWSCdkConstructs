import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { SimpleWebsiteTemplateStack } from "../lib/SimpleWebsiteStack";

test("Simple Website Stack Created", () => {
  const app = new cdk.App();
  const stack = new SimpleWebsiteTemplateStack(app, "MyTestStack");
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::S3::Bucket", {});

  template.hasResourceProperties("AWS::CloudFront::Distribution", {});
});
