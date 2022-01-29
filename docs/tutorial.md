# Hacker Finance Tutorial

## Lesson 1: Import a File

Hacker Finance takes files that you download from your
bank, or files you create manually, and imports them into
the "open batch".   

We will pretend we have downloaded transactions from a
JP Morgan Chase checking account.  The pretend downloaded file
is `tutorials/tutorial-checking.csv`  Copy and rename the file to:

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

## Lesson 1: Fully Specify our First Account

After running the import, run this command: `ts-node process`. Notice
the output says, "Accounts requiring Group, Subgroup: 1".  If we scroll
up a bit we will see the line, "New account Checking".

Hacker Finance is a build-as-you-go system.  It allows us to cheerfully
refer to accounts it knows nothing about, but it will tell us we need
to fill out the details on this new account "Checking".

We do that by opening `data/0-masters/chart-of-accounts.txt`, which 
will look like this:

```text
Group,Subgroup,Account
,,Checking
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Exchange,Transfers
Equity,Retained,Rollup
```

We are going to specify "Checking" as "Asset,Cash,Checking", which
is [explained here](./double-entry.md), so we edit the 2nd line
and save the file:

```text
Group,Subgroup,Account
Asset,Cash,Checking
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Exchange,Transfers
Equity,Retained,Rollup
```

Now run `ts-node process` again and it will say "Accounts requiring
Group,Subgroup: 0" so that job is done.  Now it is time to map
our transactions 

## Lesson 2: Automation on Exact Description Matches

The whole purpose of Hacker Finance is to map our transactions
into accounts that track income, expenses, depreciaton, 
holding, and more.  This can be very
tedious.  Hacker finance has a single automation, called
"matching", that works on transaction descriptions to do this
more easily for common recurring transactions.

Open the file `2-open-batch/unUsedDescriptionMap.csv` and note the
3rd and fourth lines, which tell us there are two desriptions that
each appear 12 times in the current open batch:

```csv
CrdAccount,Description
,AllYouCanEat Bonanzaram(1)
,BigTech PID:DD Payroll(12)
,NewJob Payroll ADP AutoDirect(12)
```

These are paychecks from the two jobs that our fictional hacker had
during the year.  We want to map them to "BigTech" and "NewJob"
respectively, so edit those to lines and:
* Add the account to the beginning
* Remove the transaction count in parentheses from the end (The "(12)").

This gives:

```csv
CrdAccount,Description
,AllYouCanEat Bonanzaram(1)
BigTech,BigTech PID:DD Payroll
NewJob,NewJob Payroll ADP AutoDirect
```

...and this time when we run `ts-node process` we ask it to match:

```
ts-node process match
```

## Lesson 3: Specify Two More Accounts

In early iterations of using Hacker Finance, we keep making up new
accounts that the system does not know about, and it will keep telling
us we need to tell it what they are.  At the end of the last
lesson we got this output:

```
   All Processing is complete
   Total transactions in transactionMap: 54
  Transactions with incomplete accounts: 24
            Transactions ready to close: 0
      Accounts requiring Group,Subgroup: 2
```

The more you use Hacker Finance, the more of your accounts it knows,
and the less you have to do this.  But in the beginning we often flip
back and forth between running `ts-node process` and going over to the
chart of accounts to fill in details.

So open up `data/0-masters/chart-of-accounts.csv` and you will see it
has two incomplete accounts:

```csv
Group,Subgroup,Account
,,BigTech
,,NewJob
Asset,Cash,Checking
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Exchange,Transfers
Equity,Retained,Rollups
```

According to the naming system [described here](./double-entry.md), we
will name these "Income,Salaried,BigTech" and "Income,Salaried,NewJob",
like so:

```csv
Group,Subgroup,Account
Income,Salaried,BigTech
Income,Salaried,NewJob
Asset,Cash,Checking
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Exchange,Transfers
Equity,Retained,Rollups
```

Save the file and run `ts-node process` again and this time we get
a very interesting bit of news.  It should tell us 24 transactions
are ready to close:

```
   All Processing is complete
   Total transactions in transactionMap: 54
  Transactions with incomplete accounts: 0
            Transactions ready to close: 24
      Accounts requiring Group,Subgroup: 0

```

## Lesson 4:  The Reward is Financial Statements

So far we have done the work of downloading a file,
naming it, running a few CLI commands, and editing a couple
of files.  Hacker Finance has told us there are transactions
ready to close, which means they are complete enough to
provide financial statements.

Open `data/4-0-statements-open/trail-balance-accounts.txt` and
you will see:

```
Trial Balance Accounts

Group     Subgroup    Account           Debits      Credits ...
--------- ----------- ----------- ------------ ------------ ...
Asset     Cash        Checking       39,041.52              ...
--------- ----------- ----------- ------------ ------------ ... 
                                     39,041.52             

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ ... 
Income    Salaried    NewJob                      20,630.76 ... 
Income    Salaried    BigTech                     18,410.76 ... 
--------- ----------- ----------- ------------ ------------ ... 
                                                  39,041.5  
```

The folder `data/4-0-statements-open` reports on transactions
that are *complete and open*.  We can check the reports there to
confirm that everything lines up as we expect.  In this case we
have total debits to the Checking account that exactly match
the two sources of income.  So these are good.

Run:

```
ts-node process close
```

This moves the 24 complete transactions out of the open batch
and into the closed batches.  We wil now see in `data/4-2-statements-closed`
that there are financial statements detailing what we have
processed and closed so far.

## Lesson 5:  Automation on Partial Description Matches

It turns out that, at least for the institutions I use, a single
description is never used more than once.  This is because they
often stick date information onto a desription, so a repeating
description like "Payment - Thank you!" shows up as "Payment - Thank You! 07/14" 
and then as "Payment - Thank you! 08/13" and so forth.  This means
the description matching we used earlier will not work most of
the time.

So Hacker Finance allows us to match on partial descriptions.

Open up the description map again `data/2-open-batch/unUsedDescriptionMap.csv`
and you can see this in the first few lines:

```
CrdAccount,Description
,AllYouCanEat Bonanzaram(1)
,PYMT ONLINE CAPITAL ONE 01/07(1)
,PYMT ONLINE CAPITAL ONE 02/12(1)
,PYMT ONLINE CAPITAL ONE 03/11(1)
,PYMT ONLINE CAPITAL ONE 04/18(1)
,PYMT ONLINE CAPITAL ONE 05/05(1)
,PYMT ONLINE CAPITAL ONE 06/03(1)
```

These are obviously all the same kind of transaction, so let's
make a simpler form of the description by editing line 3 to:
* Map to the "Payments" account
* Remove the unique parts of the description 

```
CrdAccount,Description
,AllYouCanEat Bonanzaram(1)
Payments,PYMT ONLINE CAPITAL ONE
,PYMT ONLINE CAPITAL ONE 02/12(1)
...more lines...
```

Now we run the match process again:

```
ts-node process match
```

> You may notice we did not have to tell Hacker Finance
> about the "Payments" account.  This account is built-in
> and is created when you first run `ts-node setup.ts`.

## Lesson 6: More Financial Statements

Just like our last batch, we can look at `data/4-0-statements/trial-balance-acounts.txt`
to see the complete results of the 12 transactions that are ready to close:

```
Trial Balance Accounts

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ 
Asset     Cash        Checking                     1,200.00 
--------- ----------- ----------- ------------ ------------ 
                                                   1,200.00

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------
Equity    Exchange    Payments        1,200.00              
--------- ----------- ----------- ------------ ------------ 
                                      1,200.00             
```

Here we see there are *credits* to the Checking account, which
means cash left the account.  The corresponding debits go to
the *Payments* account, which [is explained here](./exchange-accounts.md)

We can now also see what our final financial statements will
look like when these transactions are closed by looking
at `data/4-1-statements-combo/trial-balance-accounts`, which now
looks like this:

```
Trial Balance Accounts

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ 
Asset     Cash        Checking       37,841.52              
--------- ----------- ----------- ------------ ------------
                                     37,841.52             

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ 
Equity    Exchange    Payments        1,200.00              
--------- ----------- ----------- ------------ ------------ 
                                      1,200.00             

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ 
Income    Salaried    NewJob                      20,630.76 
Income    Salaried    BigTech                     18,410.76 
--------- ----------- ----------- ------------ ------------ 
                                                  39,041.52
```

As everything looks good and is balances, let's close them out

```
ts-node process close
```