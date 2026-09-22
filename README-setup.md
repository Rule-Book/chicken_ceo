git init
npm init -y
npm install express
add start script to package.json
npm install better-sqlite3
npm install dotenv?
pacman -S --needed nodejs npm
  for Dockerfile the following is required `RUN apk add python3 make` python3 alone is not sufficient

for Docker
pacman -S docker
docker build -t rulebook/chicken-ceo:latest
docker --rm -it -p 3000:3000 rulebook/chicken-ceo:latest
docker login
docker pull node:alpine3.23
docker push rulebook/chicken-ceo:latest

get aws authentication token
get aws cli
create ECR container registry after authenticating
tag the image
push to ECR
Reference ECR's image in ECS

passing json to and from api calls for performance & legibility
----
## Install Docker in ec2 to run the pre-packaged container-image
added ecr:GetAuthorizationToken and ecr:BatchGetImage policy to new ec2 instance
udo dnf install docker -y
sudo service docker start
sudo usermod -aG docker ec2-user

## Authenticate to AWS ECR Registry
aws ecr get-login-password --region us-east-2 | \
  docker login --username AWS --password-stdin \<docker-ecr-registry-url\>

logout and re-login in order for the -aG docker usergroup to reload and grant permission if you get permission denied

## Can copy docker push commands from aws account's ECR registry help button

## Run docker image
docker pull <regsitry-number>.dkr.ecr.us-east-2.amazon.aws.com/game/flight-farm:latest
docker images
docker run -d --name flight-farm -p 3000:3000 \
  <registry-number>.dkr.ecr.us-east-2.amazonaws.com/game/flight-farm

## View realtime node logs (optionally from last 50 lines)
docker logs [--tail 50] -f flight-farm

### Stop docker image before restarting
docker stop flight-farm
docker rm flight-farm
docker pull <regsitry-number>.dkr.ecr.us-east-2.amazon.aws.com/game/flight-farm:latest

## Ensure connectivity
edit EC2-instance security group role to allow inbound traffic 
  TCP, port 3000, source, 0.0.0.0/0
  Dockerfile `EXPOSE 3000`
  Node `app.listen(3000)`

many changes to ports, security groups, and stripping /api/(.\*) to \\$1 using a transform rule in the ALB before forwarding to EC2
because I do not have a Domain/DNSName and am not using a self-signed certificate, HTTPS cloudfront api requests are (per the cloudfront behavior) forwarded as http-only to the ALB over port 80, received by the ALB, stripped of /api, forwarded over port 80 to EC2 (who only accepts outbound requests from the ALB's security group). I believe EC2 responds back to the front-end with http response.
I need to update all of the await fetch calls from /* to /api/* before the ALB strips them of /api/. This is so that the ALB knows to process these requests separately from the requests for static html and static js stored in s3.

## Concerns about billing after exposing ports
Create AWS Console Billing -> Budgets
Enable email notification at 80% and 100%
