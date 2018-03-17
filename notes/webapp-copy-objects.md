The permissions for the lambda function that copies the contents of one S3 Bucket to another S3 Bucket are defined inside of the `PolicyDocument` defines the resources available 

```
{RoleName}:
    Type: AWS::IAM::Role
    Properties:

        Path: /pathname/
        AssumeRolePolicyDocument:
            Version: {xxxx-xx-xx}
            Statement: 
                -
                    Effect: Allow
                    Principal:
                        Service: lambda.amazonaws.com
                    Action: sts:AssumeRole
            Policies:
                -
                    PolicyName: {ServiceNameWhatThePolicyStatementsGrant}
                    Version: {xxxx-xx-xx}
                    Statement:
                        -
                            Sid: {StatementKeyName}
                            Effect: Allow
                            Action:
                                - "servicename:validAction"
                                ...
                            Resource: 
                                - !Sub "arn:aws:service:region:account:resource"
```

Executes a lambda function that copies the contents of one S3 bucket (source, GetObject) to another (destination + PutObject) 
# `CopyS3ObjectsFunction` 
- Contains the python code for the lambda function that manipulates the S3 Bucket:
    `copy_objects(source_bucket, source_prefix, bucket, prefix)`
    `delete_objects(bucket, prefix)`