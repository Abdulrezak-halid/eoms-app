#!/usr/bin/env bash

source .env.development.local
PATH_LOCALES=src/locales
mkdir -p $PATH_LOCALES
npx tolgee pull \
  --api-url $VITE_APP_TOLGEE_API_URL \
  --api-key $VITE_APP_TOLGEE_API_KEY \
  --project-id $VITE_APP_TOLGEE_PROJECT_ID \
  --tags front \
  --path $PATH_LOCALES
