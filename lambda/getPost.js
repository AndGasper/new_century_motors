const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
            
exports.handler = (event, context, callback) => {
  //console.log('GetPost event:', event);
  //console.log('GetPost context', context);

  var params = {
    TableName: 'Posts'
  };

  var responseBody = {
    data: []
  };

  var successResponse = {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*"
    },
    'body': responseBody,
    "isBase64Encoded": false
};

function getPosts() {
  return ddb.scan(params, function(error, results) {
    if (error) {
      console.log('error', error);
      responseBody.data.push('Error');
    } else {
      console.log('Query succeeded. results', results);
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
  console.log('getPosts then block');
  console.log('successResponse', successResponse);
  successResponse.body = JSON.stringify(successResponse.body);
  callback(null,successResponse);
}).catch((err) => {
  console.error(err);
  errorResponse(err.message, context.awsRequestId, callback);
});
  
};
            