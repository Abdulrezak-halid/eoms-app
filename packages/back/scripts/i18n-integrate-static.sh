#!/usr/bin/env bash

for i in src/locales/*; do
  # sed error is ignored in case of back or front is not available
  LANG_NAME=$(echo $i | rev | cut -d\/ -f1 | rev | cut -d. -f1);
  sed "s/\/\/ CI-LANG-LINE/&\n\"${LANG_NAME}\": () => import(\"@\/locales\/${LANG_NAME}.json\"),/" \
    -i ./src/modules/core/utils/UtilLanguage.ts || true
done
