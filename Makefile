include .make/Makefile.inc

VERSION			?= $(shell git rev-parse HEAD)
NS				?= default
REPO			?= auth-service
IMAGE			?= docker.io/smartprivacyapp/$(REPO):$(VERSION)
IMAGE_SECRET	?= carrot-docker-auth-staging
ENV 			?= <ENVIRONMENT>
APP				?= $(REPO)-$(ENV)
PORT			?= 3000
REPLICAS      	?= $(or $(shell kubectl get deployment $(APP) -o=jsonpath={.spec.replicas}), 1)
