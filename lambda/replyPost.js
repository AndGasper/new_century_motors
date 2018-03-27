const AWS = require('aws')
const ddb = new AWS.DynamoDB.DocumentClient();


exports.hanlder = (event, context, callback) => 