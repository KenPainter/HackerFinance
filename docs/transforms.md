# Transforms

Hacker Finance depends on transforms to convert CSV files to
the internal InputTransaction interface.

You have to write a transform if you bank with a financial 
instituation that Hacker Finance does not know how to import.

Transforms are trivial to write, so long as the downloaded file
is a CSV. 

Open `src/transforms.ts`, read the comments at top and follow
the instructions in the header comments.

Please consider opening a PR to contribute your transform.

Here is a typical transform:

```ts
"chaseBanking": {
    fieldCount: 7,
    mapper: (trx:InputTransaction,line:Line):void=>{
        trx.date = dateFromMDY(line[1])
        trx.description = line[2]
        trx.amount = line[3]
    }
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