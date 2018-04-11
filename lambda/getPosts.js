const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
            
exports.handler = (event, context, callback) => {
  
  if (event.requestContext) {
    if (event.requestContext.path === '/posts/{postId}') {
      const postId = event.pathParameters.postId;
      getPost(postId).then(() => {
        // console.log('getPosts then block');
        successResponse.body = JSON.stringify(successResponse.body);
        console.log('successResponse', successResponse);
        callback(null,successResponse);
      }).catch((err) => {
        console.log('catch error block');
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback);
      });
    }
}
    
  var params = {
    TableName: 'Posts'
  };

  var responseBody = {
    data: []
  };

  var successResponse = {
    "statusCode": 201,
    "headers": {
        "Access-Control-Allow-Origin": "*"
    },
    "body": responseBody,
};

function getPost(postId) {
  console.log('postId inside of getPost', postId);
  const getPostParams = {
    TableName: 'Posts', 
    Key: {
      "PostId": postId
    }
  };
  return ddb.get(getPostParams, function(error, data) {
    if (error) {
      console.log('error on getItem', error);
      responseBody.data.push('Error getting item');
    } else {
      responseBody.data.push(data);
    }
  }).promise();
}

function getPosts() {
  return ddb.scan(params, function(error, results) {
    if (error) {
      console.log('error', error);
      responseBody.data.push('Error');
    } else {
      // console.log('Query succeeded. results', results);
      results.Items.forEach(function(item) {
        responseBody.data.push(item);
      });
    }
  }).promise();
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

getPosts().then(() => {
  // console.log('getPosts then block');
  successResponse.body = JSON.stringify(successResponse.body);
  console.log('successResponse', successResponse);
  callback(null,successResponse);
}).catch((err) => {
  console.log('catch error block');
  console.error(err);
  errorResponse(err.message, context.awsRequestId, callback);
});
  
};
            