#!bash

# create the new file
mkdir "src/$1"
touch "src/$1/$1.ts"

# create the export reference
echo "export * from './$1/$1';" >> src/index.ts
sort -o src/index.ts{,}

# open it up so you can edit it
open "src/$1/$1.ts"
