const randomBytes = require('crypto').randomBytes;
  
const AWS = require('aws-sdk');
  
const ddb = new AWS.DynamoDB.DocumentClient();
  
exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }

    var requestBody = JSON.parse(event.body);
    var timeStamp = new Date().toISOString();

    var reply = {
        originalPost: requestBody.id,
        title: requestBody.submissionTitle,
        body: requestBody.submissionBody,
    };
    console.log('reply', reply);

    // Parrot the message back
    // Start with a default PostId of 0
    var responseBody = {
        "message": {
            "PostId": 0,
            "Post": message,
        }
    };
    
    var successResponse = {
        "statusCode": 201,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        'body': responseBody,
        "isBase64Encoded": false
    };
    
    // Check for empty fields
    function validateMessage(message) {
        var keys = Object.keys(message);
        var errors = [];
        // Check for empty values
        for (var i = 0; i < keys.length; i++) {
            if (message[i] === '') {
                errors.push(i);
            }
        }
        return errors;
    }
    
    if (validateMessage(reply).length === 0) {

        successResponse.body.message["PostId"] = postId;
        console.log('successResponse.body.message.postId before of then', successResponse.body.message["PostId"]);
        recordReply(reply).then(() => {

            successResponse.body = JSON.stringify(successResponse.body);
            console.log('successResponse.body.responseBody inside of then', successResponse.body);
            
            // You can use the callback function to provide a return value from your Node.js
            // Lambda functions. The first parameter is used for failed invocations. The
            // second parameter specifies the result data of the invocation.
  
            // Because this Lambda function is called by an API Gateway proxy integration
            // the result object must use the following structure.
            callback(null, successResponse);
        }).catch((err) => {
            console.error(err);
  
                // If there is an error during processing, catch it and return
                // from the Lambda function successfully. Specify a 500 HTTP status
                // code and provide an error message in the body. This will provide a
                // more meaningful error response to the end client.
                errorResponse(err.message, context.awsRequestId, callback);
            });
        }
  
        function replyToPost(reply) {
            var Params = {
                TableName: "Posts",
                Key: {
                    "PostId": reply.originalPost
                },
                UpdateExpression: "set post.replies = :r",
                ExpressionAttributeValues: {
                    ":r": reply
                },
                ReturnValues: "UPDATED_NEW"  
            };
            return ddb.update(params, function(error, result) {
                if (error) {
                    console.log('error', error);
                    responseBody.data.push('Error replying');
                } else {
                    responseBody.data.push(result);
                }
            }).promise();
        }

        // Replace all + signs with dashes (-)
        // Replace all / with underscores (_)
        // Replace all = with empty string ('')
        function toUrlString(buffer) {
            return buffer.toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        }
  
        function errorResponse(errorMessage, awsRequestId, callback) {
          callback(null, {
            statusCode: 500,
            body: JSON.stringify({
              Error: errorMessage,
              Reference: awsRequestId,
            }),
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
    };
    