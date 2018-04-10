1. Create:
- S3 Bucket for website
- S3 Bucket for Cloudformation file
- S3 Bucket for the lambda functions

2. Drop the website files into the s3 bucket for the website
3. For each bucket created in Step 1, enable static website hosting
4. Create the cognito user pool (`user-management.yaml`)
6. Drop the zip files of the lambda functions into the Lambda bucket
7. Create the API stack (`backend-api.yaml`)
    - copy and paste the arn of the user pool generated in step 5
8. Enable CORS for the API through the API Gateway UI


# Manual steps
## AWS SES
- Manually confirm an email address to send out from. Need to configure automatic update of the address, so the sender is not my personal address. 

# Confirming a user
- Assumes the user has registered through the site.
- Navigate to the AWS Cognito Pool
- Confirm the user on the back-end 


