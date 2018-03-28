1. Create:
- S3 Bucket for website
- S3 Bucket for Cloudformation file
- S3 Bucket for the lambda functions

2. Drop the website files into the s3 bucket for the website
3. For each bucket created in Step 1, enable static website hosting
4. Create the cognito user pool (`user-management.yaml`)
5. Create the API stack (`backend-api.yaml`)
    - copy and paste the arn of the user pool generated in step 4
6. Enable CORS for the API through the API Gateway UI


