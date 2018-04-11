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
    GetPostsFunction:
      Type: AWS::Lambda::Function
      Properties:
        FunctionName: GetPosts
        Runtime: nodejs6.10
        Role: !GetAtt GetPostExecutionRole.Arn
        Timeout: 5
        MemorySize: 128
        Handler: getPost.handler
        Code:
          S3Bucket: "messageboard-lambda-functions"
          S3Key: "getPosts.zip"
    ```

Debug log:
- From the back-end the `GET` (verified through API Gateway and verified the `getPost` _Lambda_ function successfully executed and returned stored posts from the _DynamoDB_ `Posts` Table ) and POST (verified the `createPost` _Lambda_ function successfully executed and verified, using the front-end website's Submit Comment form to verify the `POST`). However, when the front-end site tried to issue a GET Request, the endpoint would throw an internal server error (If memory serves, the error status code was 502.)

After setting the GetPosts Lambda execution to use the same permissions as the CreatePost Lambda function, the front-end was able to posts returned by GET. 


# [MANUALLY ENABLE CORS FOR GET REQUEST](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
- Unable to figure out how to configure headers in CloudFormation tempalte ApiGateway for GET requests to map, so manually enable through the AWS Console.


```
Add Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin Method Response Headers to OPTIONS method
Add Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin Integration Response Header Mappings to OPTIONS method
Add Access-Control-Allow-Origin Method Response Header to GET method
Add Access-Control-Allow-Origin Integration Response Header Mapping to GET method
```