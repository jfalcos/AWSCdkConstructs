# AWS CDK Constructs

## SimpleWebsiteStack + Construct

The construct creates a certificate, s3 bucket and cloudfront distribution. The cloudfront distribution uses origin access identity security; it does not use the static website configuration.

If isSinglePageApplication is true then the cloudfront distribution creates error handling for 404 and 403 to redirect to the SPA.

A hosted zone needs to be created before, so that the IAM certificate can automatically create the cnames to validate it.

The first domain name in the array is the one used as the domain name and the rest as alternate domain names.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run bootstrap` should be the first thing to run, only has to be done once
- `npm run liststacks` alias to remember whats the command in cdk to list all the stacks
- `npm run deploysimplewebsite` deploy the simple website stack
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
