# Transforms

Hacker Finance depends on transforms to convert CSV files to
the internal InputTransaction interface.

Transforms are trivial to write, so long as the downloaded file
is a CSV.  A typical transform takes 10 minutes to write.

Open `src/process-transforms.ts`, read the comments at top and follow
the instructions in the header comments.

Please consider opening a PR to contribute your transform.