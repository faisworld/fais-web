#!/bin/bash

# Find all files that import checkAdminAuth from admin-auth
files=$(grep -l "import.*checkAdminAuth.*from.*@/utils/admin-auth" $(find ./app -name "*.ts" -o -name "*.tsx"))

# Update the imports in those files
for file in $files; do
  echo "Updating $file"
  # Replace the import statement
  sed -i 's/import.*{ checkAdminAuth }.*from.*@\/utils\/admin-auth.*/import { checkAdminAuth } from "@\/utils\/auth-compat";/g' "$file"
done

echo "Done updating imports"
