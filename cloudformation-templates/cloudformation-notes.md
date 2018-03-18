# [CloudFormation Templates as a URL](https://aws.amazon.com/blogs/devops/construct-your-own-launch-stack-url/)

1. Configure a S3 Bucket for static website hosting.
2. Place CloudFormation YAML/JSON files into S3 bucket
3. Using the AWS Console, navigate to the CloudFormation resource section.
    - Click Create Stack
    - Select `Specify an Amazon S3 template URL`
        - Format:
        `https://console.aws.amazon.com/cloudformation/home?region=region#/stacks/new?stackName=stack_name&templateURL=template_location`
        `http://bucket-name.s3-website.region.amazonaws.com/file.yaml`
        Example: 
        `http://newcenturymotors-cloudformation-files.s3-website.us-east-1.amazonaws.com/user-management.yaml`
    - You can verify the template by clicking `View in designer`
    - Validate the template
    - Create stack (cloud icon with an up arrow)
    - Enter the friendly name of the bucket 
    - Acknowledge the IAM role may be created.