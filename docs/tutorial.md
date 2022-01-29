# Hacker Finance Tutorial

## Lesson 1: Import a File

Hacker Finance takes files that you download from your
bank, or manual files you create, and imports them into
the "open batch".   

We will pretend we have downloaded transactions from a
JP Morgan Chase checking account.  The pretend downloaded file
is `tutorials/tutorial-checking.`  Copy and rename the file to:

```
data/1-inputs/chaseBanking-Checking-2021.csv
```

The filename follows these conventions:

* The first segement names the transform.  These are not covered
  in the tutorial, you can read about them [here](./transforms.md).
* The second segment names the account. Every file from the
  same account should forever use the exact same spelling
  for the account.   
* The third segment is anything you want, something easy to
  understand if you glance at it two years later.

Run `ts-node import`, we should see something like this:

```
   IMPORTED FILE chaseBanking-Checking-2021.csv
      Debit Account: Checking
      Trx Count: 54
      Sum of Transactions:    22,587.91

   Final transaction counts
      Current open transactions:  0
      New transactions added:  54
      Total open transactions after import: 54
      Appending to transaction map  data/2-open-batch/transactionMap.csv
```

## Lesson 1: Map One Transaction Manually

TO BE CONTINUED...