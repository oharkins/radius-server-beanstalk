const AWS = require('aws-sdk');
const { DateTime } = require("luxon");

AWS.config.region = 'us-east-1';

var docClient = new AWS.DynamoDB.DocumentClient();


var currentDate = Number(DateTime.local().toFormat('yyyyLLdd'));
var params = {
    TableName: "wifi_users",
    KeyConditionExpression: "#usr = :user AND ExpireDate >= :expire ",
    FilterExpression: "Password = :pw",
    ExpressionAttributeNames: {
        "#usr": "User"
    }    
};

module.exports.access = async (user, password) => {
    var access=false;
    console.log("inside activeUser");    

    params["ExpressionAttributeValues"] = 
    {
        ":user": user,
        ":expire": currentDate,
        ":pw": password
    };

    await docClient.query(params).promise()
        .then((data) => {
            console.log("inside Query")
            if (data.Count >= 1) {
                access = true;
            }       
        })
        .catch((eror)=>{
            console.log("Error")
        })
    return access;
};
    // console.log(access);
    // return access;




