const randomBytes = require('crypto').randomBytes;
  
const AWS = require('aws-sdk');
  
const ddb = new AWS.DynamoDB.DocumentClient();
const sesClient = new AWS.SES();
const sesConfirmedAddress = "<gasperandres1@gmail.com>" // pls no spam
  
exports.handler = (event, context, callback) => {
    // if (!event.requestContext.authorizer) {
    //     errorResponse('Authorization not configured', context.awsRequestId, callback);
    //     return;
    // }
    
    // console.log('event', event);
    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    // const username = event.requestContext.authorizer.claims['cognito:username'];
    console.log('event.requestContext', event.requestContext);

    
    console.log('sesClient:', sesClient);

    // The body field of the event in a proxy integration is a raw string.
    var requestBody = JSON.parse(event.body);
    var timeStamp = new Date().toISOString();
    // console.log('requestBody', requestBody);
    // If the request body has an id, then this is a reply 
    if (requestBody.id) {
        var message = {
            originalPost: requestBody.id,
            title: requestBody.title,
            body: requestBody.body,
            dealership: 'reply',
            group: 'reply',
            replies: [],
        };
    } else {
        var message = {
            title: requestBody.submissionTitle,
            body: requestBody.submissionBody,
            dealership: requestBody.dealership,
            group: requestBody.group,
            replies: []
        };
           
    }
    var postNotificationEmailParams = {
        Destination: {
            ToAddresses: [sesConfirmedAddress]
        },
        Message: {
            Body: {
                Text: {
                    Data: message.title
                }
            }, 
            Subject: {
                Data: 'Someone has posted'
            },
        },
        Source: sesConfirmedAddress,
        ReplyToAddresses: [sesConfirmedAddress]
    };
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

    // Build a unique post id from the post so that the post can be retrieved later
    // There may be a non-trivial probability that timestamps from the same group 
    function createUniquePostIdFromMessage(message, timeStamp) {
        var postId = message.title + message.dealership + message.group + timeStamp;
        var timeStampArray = [];
        for (var i = 0; i < timeStamp.length; i++) {
            if (parseInt(timeStamp[i], 10)) {
                timeStampArray.push(timeStamp[i]);
            }
        }
        // There may be a simpler (better) way of implementing unique ids for the posts
        var partitionID = timeStampArray.reduce(function(a,b) { return a*b;}); // The product of the timestamp digits 
        postId = postId + "." + partitionID.toString(); // postId.partitionId
        return postId;
    }
    function trimWhiteSpaceAndConvertSpaceToDash(stringWithSpaces) {
    
        var editedString = stringWithSpaces.trim();
        editedString = stringWithSpaces.replace(/\s/g, '-');
        return editedString;
    }
    if (validateMessage(message).length === 0) {
        // console.log('validate message 0 errors');
        // console.log(postId);
        // console.log('successResponse', successResponse); 
        var postId = createUniquePostIdFromMessage(message, timeStamp); // Update postId
        postId = trimWhiteSpaceAndConvertSpaceToDash(postId);
        successResponse.body.message["PostId"] = postId;
        console.log('successResponse.body.message.postId before of then', successResponse.body.message["PostId"]);
        // Intentional duplicate code blocks for then statement just to verify the replies work
        if (message.originalPost) {
            responseBody.data = [];
            recordReply(message).then(() => {
                successResponse.body = JSON.stringify(successResponse.body);
                console.log('successResponse.body.responseBody inside of then', successResponse.body);
                
                callback(null, successResponse);
            }).catch((err) => {
                console.error(err);
                errorResponse(err.message, context.awsRequestId, callback);
            });
        } else {
            recordPost(postId, message).then(() => {
                successResponse.body = JSON.stringify(successResponse.body);
                // Call the ses client to send the email
                var sendEmailPromise = sesClient.sendEmail(postNotificationEmailParams).promise();
                sendEmailPromise.then(function(result) {
                    console.log('sendEmailPromise result', result);
                    callback(null, null);
                }).catch(function(error) {
                    console.log('error in email', error);
                    callback(null, null);
                });
                console.log('successResponse.body.responseBody inside of then', successResponse.body);
                callback(null, successResponse);
            }).catch((err) => {
                console.error(err);
                errorResponse(err.message, context.awsRequestId, callback);
            });
        }
  
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

        function recordReply(reply) {
            console.log('recordReply reply', reply);
            var params = {
                TableName: "Posts",
                Key: {
                    "PostId": reply.originalPost
                },
                UpdateExpression: "SET Post.replies = list_append(Post.replies, :attrValue)",
                ExpressionAttributeValues: {
                    ":attrValue": [reply]
                }
            };
            console.log('params', params); 
            return ddb.update(params, function(error, result) {
                console.log('result', result);
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
    }
}