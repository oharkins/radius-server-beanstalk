# Radius Server with NOSQL DB

> Autodeployment with beanstalk

> NOSQL database, DynamoDB

> Amazon Web Services, Authentication system, Serverless

This repository deploy a full authentication system to integrated with the firewall via Radius protocol. It uses beanstalk service to autodeploy the Data Base (dynamosDB), the instances, security group and roles needed. 

**Deployment**

1. Choose name for the database name (DBNAME) and the SECRET in the .ebextensions/parameters.config file

2. Deployment with amazon console:
    1. Open amazon beanstalk service
    2. Click on Create a new environment
    3. Chose web server environment
    4. Chose node.js platform
    5. Upload the this repository on a .zip

   Deployment with EB cli:
    1. Install de EB cli: [Link](https://docs.aws.amazon.com/es_es/elasticbeanstalk/latest/dg/eb-cli3.html)
    2. *During the EB cli init choose node.js platform*
    3. Open the console inside the root directory of the repository
    4. In the console write:
        ```
        eb create
        ```
    5. Chose the configuration settings


---

## FAQ

- **How do I do *specifically* so and so?**
    - No problem! Just do this.

---