#!/usr/bin/env bash

source .env
PATH_LOCALES=src/locales
mkdir -p $PATH_LOCALES
npx tolgee pull \
  --api-url $TOLGEE_API_URL \
  --api-key $TOLGEE_API_KEY \
  --project-id $TOLGEE_PROJECT_ID \
  --tags back \
  --path $PATH_LOCALES
