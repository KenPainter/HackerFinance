# Transforms

Hacker Finance depends on transforms to convert CSV files to
the internal InputTransaction interface.

Transforms are trivial to write, so long as the downloaded file
is a CSV.  A typical transform takes 10 minutes to write.

Open `src/process-transforms.ts`, read the comments at top and follow
the instructions in the header comments.

Please consider opening a PR to contribute your transform.

Here is a typical transform:

```ts
'chaseBanking': (acct:string, fileText:string):Inputs => { 
    return linesFromCSV(fileText)
        .map(line=>{
            return { 
                date: dateFromMDY(line[1]),
                amount: makeNumber(line[3]),
                description: line[2],
                inpAccount: acct,
                inpOffset: '',
            }
        })
},
```

## Why Not QBO?

Because QBO files are a nightmare.  They are not in any way well-formed,
and are very tricky to directly edit in Your Favorite Code Editor(tm).

CSV files are easier to code for and easier to monkey with as a user, plus
you can load them up to a spreadsheet to sort them any way you like
for editing.

It is also much easier to write a transform for a CSV, and I haven't found
a financial institution yet that does not offer them.

In fact CSV files turned out to be so useful to the "hacker friendly"
approach I needed that all files in Hacker Finance that you interact
with are CSV files.