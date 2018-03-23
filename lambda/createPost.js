const randomBytes = require('crypto').randomBytes;
  
const AWS = require('aws-sdk');
  
const ddb = new AWS.DynamoDB.DocumentClient();
  
exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }
    console.log('Received event (', postId, '): ', event);
  
    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    const username = event.requestContext.authorizer.claims['cognito:username'];
  
    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.

    const requestBody = JSON.parse(event.body);
    const timeStamp = new Date().toISOString()
  
    const message = {
      title: requestBody.submissionTitle,
      body: requestBody.submissionBody,
      dealership: requestBody.dealership,
      group: requestBody.group
    };
    
    // Check for empty fields
    function validateMessage(message) {
        var keys = Object.keys(message);
        // Check for empty values
        for (i = 0; i < keys.length; i++) {
            if (message[key] === '') {
                errors.push(key);
            }
        }
        return errors;
    }

    // Build a unique post id from the post so that the post can be retrieved later
    // There may be a non-trivial probability that timestamps from the same group 
    function createUniquePostIdFromMessage(message, timeStamp) {
        var postId = message.title + message.dealership + message.group + timeStamp;
        var timeStampArray = [];
        for (i = 0; i < timeStamp.length; i++) {
            if (parseInt(timeStamp[i])) {
                timeStampArray.push(timeStamp[i]);
            }
        }
        // There may be a simpler (better) way of implementing unique ids for the posts
        var partitionID = timeStampArray.reduce(function(a,b) { return a*b;}); // The product of the timestamp digits 
        postId = postId + "." + partitionID.toString(); // postId.partitionId
        return postId;
    }
    if (validateMessage(message).length === 0) {
        recordPost(postId, message).then(() => {
            // You can use the callback function to provide a return value from your Node.js
            // Lambda functions. The first parameter is used for failed invocations. The
            // second parameter specifies the result data of the invocation.
  
            // Because this Lambda function is called by an API Gateway proxy integration
            // the result object must use the following structure.
            callback(null, {
                statusCode: 201,
                body: JSON.stringify({
                    PostId: postId,
                    Post: message,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }).catch((err) => {
            console.error(err);
  
                // If there is an error during processing, catch it and return
                // from the Lambda function successfully. Specify a 500 HTTP status
                // code and provide an error message in the body. This will provide a
                // more meaningful error response to the end client.
                errorResponse(err.message, context.awsRequestId, callback);
            });
        };
  
        function recordPost(postId, post, timeStamp) {
            return ddb.put({
                TableName: 'Posts',
                Item: {
                    PostId: postId,
                    Post: post,
                    PostTime: timeStamp,
                },
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
    }
    