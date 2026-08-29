## Phase 1 Requirements & Initial Setup
- [x] Setup local git repo
- [x] Setup Hello World in node
- [x] Log localStorage cookie or create if not created
- [x] Call requestAnimationFrame in Vanilla JS to show counter ticking up
- [x] Setup REST API to *create* & *load* user in sqlite
- [x] Setup sqlite database
- [ ] implement REST API *save* user function
- [ ] implement remaining REST API functions
## Phase 2 Gameplay
- [ ] add front-end buttons and methods to call API endpoints
- [ ] hook up front-end buttons to API methods that update the DB
- [ ] add logic to automatically call *save* X times/min
- [ ] manually test game plays logically
## Phase 3 Migrate to Cloud
- [ ] determine logical translations of components to AWS resources
  - (persistent) database
  - front\_end *html with vanilla js*
  - back\_end *node.js*
## Phase 4 CICD
- code-base *host on github*
- deploy application *github actions?*
- deploy configuration updates *Terraform*
- containerization *custom built container-image deployed with npm run start command* to EKS
## Phase 5 Logging
- [ ] tbd
## Phase 6 Security
- [ ] tbd
