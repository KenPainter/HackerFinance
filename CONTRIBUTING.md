# CONTRIBUTING

Contributions are welcome, please understand the basic premises as
described here.

## Processing Flow

Hacker Finance expects the user to likely have to run `process.ts` 
iteratively.  Each time the use runs it the program tells them what is
working and OK and what it needs them to fix.

Therefore there is no concept of an "error" when processing.  Instead of
stopping on errors, the program always runs completely from the first
step to last, doing everything it can with what it has.  Anything that
we might consider an "error" is added `reports/to-do.txt` as a task
for the user.

Hacker Finance talks to the user in two ways:
* Log commands just describe the path taken through processing
* the `reports/to-do.txt` tells the user what they have to do.