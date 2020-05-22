const AWS = require('aws-sdk');
const { DateTime } = require("luxon");
const config = require ('config');

AWS.config.region = config.get("AWS-region");



module.exports.access = async (username, password) => {
    var access=false;
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log("inside activeUser");    

    var request = this.createRequest(username,password)

    await docClient.query(request).promise()
        .then((data) => {
            console.log("inside Query")
            if (data.Count >= 1) {
                access = true;
            }       
        })
        .catch((error)=>{
            console.log(error)
        })
    return access;
};
    // console.log(access);
    // return access;


module.exports.createRequest = (username, password)=>{
    var currentDate = Number(DateTime.local().toFormat('yyyyLLdd'));
    var params = {
        TableName: config.get('table-name'),
        KeyConditionExpression: "#usr = :user AND ExpireDate >= :expire ",
        FilterExpression: "Password = :pw",
        ExpressionAttributeNames: {
            "#usr": "User"
        },
        ExpressionAttributeValues:{
            ":user": username,
            ":expire": currentDate,
            ":pw": password
        } 
    };      
    return params;
}

module.exports.getCode = async (username, password) => {
    var code = 'Access-Reject';

    if (await this.access(username,password)){
        code = 'Access-Accept';
    }

    return code;

}

