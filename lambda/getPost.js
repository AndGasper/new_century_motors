const AWS = require('aws-sdk');
            
exports.handler = (event, context, callback) => {
  console.log('GetPost event:', event);
  console.log('GetPost context', context));
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
}
            