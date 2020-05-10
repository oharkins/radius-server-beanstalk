const AWS = require('aws-sdk');
const { DateTime } = require("luxon");

AWS.config.region = 'us-east-1';

var docClient = new AWS.DynamoDB.DocumentClient();



module.exports.access = function (user, password) {
    console.log("inside activeUser");
    var access = false;
    var currentDate = Number(DateTime.local().toFormat('yyyyLLdd'));
    var params = {
        TableName: "wifi_users",
        KeyConditionExpression: "#usr = :user AND ExpireDate >= :expire ",
        FilterExpression: "Password = :pw",
        ExpressionAttributeNames: {
            "#usr": "User"
        },
        ExpressionAttributeValues: {
            ":user": user,
            ":expire": currentDate,
            ":pw": password
        }
    };

    docClient.query(params, (err, data) => {
        console.log("inside Query")
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {

            if (data.Count >= 1) {
                access = true;
            } else {
                access = false;
            }
            return access
        }
        return access;
    });


}

