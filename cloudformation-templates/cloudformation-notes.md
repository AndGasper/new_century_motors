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

# `backend-api.yaml` 
- Related file: clientSidePost.json => Mock data structure for client-side submission by an employee

# `user-management.yaml`
- Creates the Cognito Pool. (Assumes one already has a S3 Bucket for the site configured.)

# `CreatePostFunction`
There's an upper limit to what the raw cloudformation template will accept for lambnda function length, so the Lambda functions have been moved to zip files inside of a S3 bucket



# No integration method
- When the `z-amazon-apigateway-integration` is malformed, `No integration method` is thrown for the `MessageBoardApiDeploy`


# A word on Lambda functions
- Notice that the `Handler` attribute matches the zip file name
- ``` 
    GetPostFunction:
      Type: AWS::Lambda::Function
      Properties:
        FunctionName: GetPost
        Runtime: nodejs6.10
        Role: !GetAtt GetPostExecutionRole.Arn
        Timeout: 5
        MemorySize: 128
        Handler: getPost.handler
        Code:
          S3Bucket: "messageboard-lambda-functions"
          S3Key: "getPost.zip"
    ```
