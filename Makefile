# Local helpers for the E2E suite. `make help` lists them.
.DEFAULT_GOAL := help
.PHONY: help e2e-local e2e-local-down

help: ## Show the commands
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_.-]+:.*##/ { printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

e2e-local: ## Build the images for this machine from ../vietgara-*, run the whole suite on them (GREP=… KEEP=1 SKIP_BUILD=1 PLATFORM=… ARGS="…")
	@scripts/e2e-local.sh $(ARGS)

e2e-local-down: ## Stop the stack that KEEP=1 left running and delete its data
	@BACKEND_TAG=local OWNER_WEB_TAG=local ADMIN_WEB_TAG=local docker compose -f ci/compose.yml down -v --remove-orphans
