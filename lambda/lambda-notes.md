# 1. Create S3 Bucket for Lambda Functions
## ***ASSUMPTION*** : The S3 bucket is in the same region as your CloudFormation Script
1. Create separate S3 Bucket for the lambda functions, e.g. `messageboard-lambda-functions`

# 2. Convert js to zip
1. Right click `*.js` file in windows explorer 
2. "Add to filename.zip" (create zip) 

## 3. Upload to `messageboard-lambda-functions`
Drag+drop/upload through CLI zip file into
`messageboard-lambda-functions`


# `lambda/tests`
## createPostTest.json
- Event object 