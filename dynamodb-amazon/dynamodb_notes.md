# DynamoDB Structure 

```
PostsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: Posts
        AttributeDefinitions:
          -
            AttributeName: PostId
            AttributeType: S
        KeySchema:
          -
            AttributeName: PostId
            KeyType: HASH
        ProvisionedThroughput: 
          ReadCapacityUnits: 5
          WriteCapacityUnits: 5
```