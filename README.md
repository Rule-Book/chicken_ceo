## Phase 1 Requirements & Initial Setup
- [x] Setup local git repo
- [x] Setup Hello World in node
- [x] Log localStorage cookie or create if not created
- [x] Call requestAnimationFrame in Vanilla JS to show counter ticking up
- [x] Setup REST API to *create* & *load* user in sqlite
- [x] Setup sqlite database
- [x] implement REST API *save* user function
- [x] implement remaining REST API functions
## Phase 2 Gameplay
- [x] add front-end buttons and methods to call API endpoints
- [x] hook up front-end buttons to API methods that update the DB
- [x] add logic to automatically call *save* X times/min
- [ ] manually test game plays logically
## Phase 3 Migrate to Cloud
- [x] determine logical translations of components to AWS resources
  - (persistent) database
  - front\_end *html with vanilla js*
  - back\_end *node.js*
    - working now as ec2 instance hosting docker-container with front\_end + back\_end exposing port 3000
- [ ] move public folder to S3 bucket
- [ ] create AWS CloudFront Distribution connected to S3 bucket
- [ ] create certificate to allow HTTPS traffic with AWS Certificate Manager (ACM)
- [ ] create Application Load Balancer (using certificate) to process HTTPS requests from CloudFront -> ALB -> EC2
- [ ] update backend 
  - to listen for HTTP requests from ALB (port 80/8080)
  - security group to allow incoming 80/8080 requests instead of 3000
- [ ] migrate from docker-contained sqlite db to remote PostgresQL db
  - [ ] tbd
## Phase 4 CICD
- code-base *host on github*
- deploy application *github actions?*
- deploy configuration updates *Terraform*
- containerization *custom built container-image deployed with npm run start command* to EKS
## Phase 5 Logging
- [ ] tbd
## Phase 6 Security
- [ ] tbd
