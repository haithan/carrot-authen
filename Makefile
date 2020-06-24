include .make/Makefile.inc

VERSION			?= $(shell git rev-parse HEAD)
NS				?= default
REPO			?= auth-service
IMAGE			?= docker.io/carrott/$(REPO):$(VERSION)
IMAGE_SECRET	?= circle-ci-auth
APP				?= $(REPO).<ENVIRONMENT>
PORT			?= 3000
REPLICAS      	?= $(or $(shell kubectl get deployment $(APP) -o=jsonpath={.spec.replicas}), 1)
