# Hacker Finance Tutorial

This tutorial walks through every feature available in Hacker
Finance.  It contains not just the commands, but the expected
output, so it should be suitable for a read-through before
putting fingers to keyboard.

## Setup the Tutorial Working Set

The system allows for multiple working sets.  Right now we
will create one for the tutorial, and later you can create
a live one while keeping the tutorial around for reference.

```
ts-node set-root.ts tutorial
```

The `set-root` routine is idempotent, you can run it over and
over to create a working set or switch working sets.

> This command creates a set of directories under `data/tutorial`.
> The `data` directory is ignored by .gitignore, so in the event
> you make a contribution to the code your personal data will
> not be pushed to github.

## Import a File

Hacker Finance takes files that you download from your
bank, or files you create manually, and imports them into
the open set.

We will pretend we have downloaded transactions from a
JP Morgan Chase checking account.  The pretend downloaded file
is `tutorials/tutorial-checking.csv`  Copy and rename the file to:

```
data/tutorial/1-inputs/chaseBanking-Checking-2021.csv
```

The filename follows these conventions:

* The first segement names the transform.  These are not covered
  in the tutorial, you can read about them [here](./transforms.md).
* The second segment names the account. Every file from the
  same account should forever use the exact same spelling
  for the account.   
* The third segment is anything you want, something easy to
  understand if you glance at it two years later.

Run `ts-node import`.  The logging is quite verbose, but at the
end we see something like this:

```
1 new accounts added to chart of accounts
New account: Checking
...
...
Total transactions: 54
Mapped to incomplete accounts: 0
Ready to close: 0
No transactions are ready to close, not running any statements.
```

For now we just note that 54 transactions were imported, and that
the system has detected a reference to an account, "Checking", that
it does not know about.

## Fully Specify our First Account

Hacker Finance is a build-as-you-go system.  It allows us to cheerfully
refer to accounts it knows nothing about, but it will tell us we need
to fill out the details on this new account "Checking".

We do that by opening `data/tutorial/0-masters/chart-of-accounts.csv`, which 
will look like this:

```csv
Group,Subgroup,Account
,,Checking
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Exchange,Transfers
Equity,Retained,BeginBalances
Equity,Retained,Rollup
```

We are going to specify "Checking" as "Asset,Cash,Checking", which
is [explained here](./double-entry.md), so we edit the 2nd line
and save the file:

```csv
Group,Subgroup,Account
Asset,Cash,Checking
Equity,Exchange,Payments
Equity,Exchange,Splits
Equity,Exchange,Transfers
Equity,Retained,Rollup
```

Whenever we update a file, we run `ts-node process` so the system
can determine the new status. The system no longer reports any
new accounts, but still says there are 54 transactions, and none
of them are ready to close:

```
Total transactions: 54
Mapped to incomplete accounts: 0
Ready to close: 0
No transactions are ready to close, not running any statements.
```

## Mapping Transactions Automatically by Description

The whole purpose of Hacker Finance is to map our transactions
into accounts that track income, expenses, depreciaton, 
holding, and more.  This can be very tedious.  But if you tell
the system how to recognize recurring and common transactions
based on their description, things go much faster.

Open the file `data/tutorial/2-open/descriptionMap.csv` and note the
3rd and fourth lines, which tell us there are two desriptions that
each appear 12 times in the current open batch:

```csv
Credit Account,Description
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

Since we have changed a file, we run `ts-node process` again and we see
that it now claims 24 transactions are "incomplete", this is because they
are referring to unknown accounts, "BigTech" and "NewJob".  We see as well
that the system is logging that it has seen these account:

```
2 new accounts added to chart of accounts
New account: BigTech
New account: NewJob
...
...
Total transactions: 54
Mapped to incomplete accounts: 24
Ready to close: 0
No transactions are ready to close, not running any statements.
```


## Specify Accounts BigTech and NewJob

In early iterations of using Hacker Finance, we keep making up new
accounts that the system does not know about, and it will keep telling
us we need to tell it what they are.  At the end of the last
lesson we got this output:

The more you use Hacker Finance, the more of your accounts it knows,
and the less you have to do this.  But in the beginning we often flip
back and forth between running `ts-node process` and going over to the
chart of accounts to fill in details.

So open up `data/tutorial/0-masters/chart-of-accounts.csv` and you will see it
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

> Once you are comfortable with the iterative use of `ts-node process`
> you can skip a step and specify your accounts in advance in the
> chart of accounts.

Save the file and run `ts-node process` again and this time we get
a very interesting bit of news.  It should tell us 24 transactions
are ready to close:

```
Total transactions: 54
Mapped to incomplete accounts: 0
Ready to close: 24
```

We might have to scroll up a bit to see those messages, because this
time the system took an extra step.  Seeing there were fully complete
transactions, it automatically ran statements for us.

## Financial Statements on the Open Set

So far we have done the work of downloading a file,
naming it, running a few CLI commands, and editing a couple
of files.  Hacker Finance has told us there are transactions
ready to close, which means they are complete enough to
provide financial statements.

Open `data/tutorial/4-0-statements-open/trail-balance-accounts.txt` and
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

## Closing the Transactions

Now that we are satisfied we have processed automatically the
paychecks, we want to get them out of the way, simplifying the
list of remaining transactions.

Run

```
ts-node process close
```

This moves the 24 complete transactions out of the open batch
and into the closed batches.  We wil now see in `data/tutorial/4-2-statements-closed`
that there are financial statements detailing what we have
processed and closed so far.

## Mapping Based on Partial Descriptions

It turns out that, at least for the institutions I use, a single
description is never used more than once.  This is because they
often stick date information onto a desription, so a repeating
description like "Payment - Thank you!" shows up as "Payment - Thank You! 07/14" 
and then as "Payment - Thank you! 08/13" and so forth.  This means
the description matching we used earlier will not work most of
the time.

So Hacker Finance allows us to match on partial descriptions.

Open up the description map again `data/tutorial/2-open/unUsedDescriptionMap.csv`
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
...
...
```

Now we run the main process:

```
ts-node process 
```

> You may notice we did not have to tell Hacker Finance
> about the "Payments" account.  This account is built-in
> and is created when you first run `ts-node setup.ts`.



## Lesson 6: More Financial Statements

Because "Payments" is a built-in account, we did not have to
edit the chart of accounts, and all 12 of those payments are
now ready to close.  Just like our last batch, 
we can look at `data/tutorial/4-0-statements/trial-balance-acounts.txt`
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
ts-node close
```


## The Last of The Repeating Transactions

Let's repeat our partial description trick to close out
a few more recurring transactions.  Make these changes
in `data/2-open/unUsedDescriptionMap.csv`

```
// find this line
,Transfer to Savings ending in 9999 05/23(1)
// change it to this
Transfers,Transfer to Savings ending in 9999

// Then find this line
,Zelle Payment To Mr Landlord 01/01(1)
// change it to this
Rent,Zelle Payment To Mr Landlord 

```

Run `ts-node process` and we are told there is one new account
which must be specified.  Open the chart of accounts and specify
'Rent' as "Expense,Residence,Rent".  Then again run `ts-node process`.

If you are happy with the statements, run `ts-node close` and
our final current Trial Balance should look like this:

```
Group     Subgroup    Account           Debits      Credits
--------- ----------- ----------- ------------ ------------
Asset     Cash        Checking       22,841.52             
--------- ----------- ----------- ------------ ------------ 
                                     22,841.52             

Group     Subgroup    Account           Debits      Credits
--------- ----------- ----------- ------------ ------------
Equity    Exchange    Payments        1,200.00             
Equity    Exchange    Transfers         600.00            
--------- ----------- ----------- ------------ ------------
                                      1,800.00             

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ 
Income    Salaried    NewJob                      20,630.76 
Income    Salaried    BigTech                     18,410.76
--------- ----------- ----------- ------------ ------------
                                                  39,041.52

Group     Subgroup    Account           Debits      Credits
--------- ----------- ----------- ------------ ------------
Expense   Residence   Rent           14,400.00             
--------- ----------- ----------- ------------ ------------
                                     14,400.00           
```

## Lesson 8: Mapping Individual Transactions

We have two transactions left to map in the checking account,
and as they are not repeating transactions, we will go in
and map them directly.

Open up the transaction map `data/tutorial/2-open/transactionMap.csv`:

```csv
Credit Account,Debit Account,Date,Amount,Description,Source
,Checking,20210501,-55.47,"Super Deluxe Multi-Cinema",chaseBanking-Checking-2021.csv
,Checking,20210715,-198.14,"AllYouCanEat Bonanzaram",chaseBanking-Checking-2021.csv
```

It looks like somebody went to the movies and also to an all-you-can-eat
restaurant.  How should these be mapped?  In Hacker Finance you can map
them any way you want.  For this tutorial we will keep it simple and assume
that our user calls them both "NightOut".  So we directly edit the
transaction map and put in "NightOut" at the beginning of the two lines.

```csv
Credit Account,Debit Account,Date,Amount,Description,Source
NightOut,Checking,20210501,-55.47,"Super Deluxe Multi-Cinema",chaseBanking-Checking-2021.csv
NightOut,Checking,20210715,-198.14,"AllYouCanEat Bonanzaram",chaseBanking-Checking-2021.csv
```

We also know that the system will require us to specify "NightOut" in
the chart of accounts, so we jump ahead and do that now:

```
Group,Subgroup,Account
Expense,Leisure,NightOut
...
...
```

We run `ts-node process` to get the new statements, review them, and
run `ts-node close`.

## Lesson 9: Checking Begin Balance

We are now finished with the checking account.  Or are we?  There is one
more step.

If we look at the statements after finishing the checking account, we
see the checking account has a total debit balance of 22,587.91.  But
when we go online to our bank's website we see the checking account
had an ending balance on 2021-12-31 of 23,123.45.  We expect Hacker
Finance to correctly report our bank balance, but it cannot do this
because we never told it about the *beginning balance*.

This is easy to take care of.  We run a new command `ts-node manual-input.ts`
that will create a *manual input* file for us.  It creates the file
`data/tutorial/1-inputs/manual-x-x.csv`.  We want to rename that to something 
that makes more sense, so call it `manual-Checking-begin2021.csv`

> Another way to do this, once you are comfortable, is to actually
> directly edit the downloaded file and drop a transaction in there.

Open the file and manually add this line:

```
Credit Account,Debit Account,Date,Amount,Description,Source
BeginBalances,Checking,20201231,535.54,Manually Credit Begin Balance,x
```

In a manual input we specify both the credit and debit account, the
name of the file does not matter.  We have said we want a single
transaction that:
* Credits the BeginBalances account, which you can [read about here](./equity-accounts.md)
* Debits the Checking account
* The amount is always in reference to the debit account, so
  * a positive number means we are debiting Checking
  * a negative number would mean a negative debit, which is the same as a credit

Now we should be able to run in succession, without problems:

```
ts-node import
ts-node process
ts-node close
```

And when we look at the statements, we will see the correct
beginning balance for the checking account:

```
Balance Sheet Accounts

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ 
Asset     Cash        Checking       23,123.45              
--------- ----------- ----------- ------------ ------------ 
                                     23,123.45             

Group     Subgroup    Account           Debits      Credits 
--------- ----------- ----------- ------------ ------------ 
Equity    Exchange    Payments        1,200.00              
Equity    Exchange    Transfers         600.00              
Equity    Retained    BeginBalanc                    535.54 
--------- ----------- ----------- ------------ ------------ 
                                      1,264.46             

```

## The Saving Account

The savings account is much simpler, so we will do the entire
thing in one lesson.

Pretend we downloaded the transactions from the bank website
and saved them to `tutorial-inputs/tutoral-savings.csv`.  Copy
and rename that file to `data/tutorial/1-inputs/chaseBanking-Savings-2021.csv`.

Before you run `ts-node import` we are going to save ourselves some steps.

First, we know that when we process this file the system will detect
a new account called "Savings" and ask us to specify it.  We may as
well do that now while we are in the code editor.

Edit `data/tutorial/0-masters/chart-of-accounts.csv` and add at the top:

```
Group,Subgroup,Account
Asset,Cash,Savings
...
...
```

Also we know that we need to do the begin balance, so we can save some
work by directly addin a line to the downloaded file that establishes
the begin balance:

```
Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #
x,12/31/2020,"Manually added begin balance",3000.00,x,0,,
x,05/23/2021,"Transfer from Checking ending in 9999 05/23",150.00,x,0,,
x,07/23/2021,"Transfer from Checking ending in 9999 07/23",150.00,x,0,,
x,09/23/2021,"Transfer from Checking ending in 9999 09/23",150.00,x,0,,
x,11/23/2021,"Transfer from Checking ending in 9999 11/23",150.00,x,0,,

```

> Hacker Finance only needs date, description and amount.  That's
> why you see litle 'x' marks and '0' values in other fields.

> Chase has a weird glitch in their download files.  The header lists
> 7 fields, but each line contains 8 fields, so be sure to put in
> two commas at the end of the line.

Now do the following steps to completely process the file:

* `ts-node import`
* Go to the `descriptionMap` and map all transactions to "Transfers"
* Go to `transactionMap` and map the begin balance to "BeginBalances"
* `ts-node process`
* Review statements for correctness
* `ts-node close`

If all goes well the line for the Equity-Exchange-Transfers should 
disappear, because it has no balance.  All transfers into savings from
the Checking account download have matched up to the transactions
downloaded for Savings, so it zeros out.

## The Credit Card

The credit card is even simpler than the Savings account.  See if you
can process it start to end with these steps:

* Copy and rename to `capOneCC-Card9999-2021.csv`
* Assume a start balance of 1400.00. Look at the existing transactions
  to see how to enter it manually.
* Run `ts-node import` 
* Update the chart of Accounts
  * Card999 becomes Liability,Revolving,Card999
  * Interest becomes Expense,Revolving,Interest
* Use the descriptionMap to map ALL transactions, run `ts-node process`
* run `ts-node process` again, review the statements
* run `ts-node close`

Both exchange accounts should now be empty.

## Rolling Up The Year

In real life there would be far more transactions than this, but 
for now this should get the idea across.  So we will assume 
everything has been entered.

The last step is to roll up the year.  As we have processed all
transactions for 2021, we want to zero them out, capture the
change in net worth, and start on 2022. 

> More information on why we do a rollup is in [Equity Accounts](./equity-accounts.md)

The rollup does not create any new accounts, so we can proceed
directly with:

```
ts-node rollup
ts-node import
ts-node close
```

The financial statements will now have all expenses and income
zero'd out, and the change in net worth for the year has been
moved to equity:

```
Balance Sheet Accounts

Group     Subgroup    Account            Debits       Credits
--------- ----------- ----------- ------------- ------------- 
Asset     Cash        Checking        23,123.45              
Asset     Cash        Savings          3,600.00              
--------- ----------- ----------- ------------- ------------- 
                                      26,723.45              

Group     Subgroup    Account            Debits       Credits 
--------- ----------- ----------- ------------- ------------- 
Liability Revolving   Card999                          410.96
--------- ----------- ----------- ------------- -------------
                                                       410.96

Group     Subgroup    Account            Debits       Credits
--------- ----------- ----------- ------------- -------------
Equity    Retained    Rollups                       24,176.95
Equity    Retained    BeginBalanc                    2,135.54
--------- ----------- ----------- ------------- -------------
                                                    26,312.49
```

## A Budget for Next Year

Now that the system has some idea of income and spending
for the prior year, it is possible to make a rough budget
for the next year.

```
ts-node make-budget
```

Now you can find and open `data/tutorial/0-masters/budget-2022.csv`.
This account will never again be touched by the system, and it is
expected the user will heavily modify it as the year goes on.

During the year the comparison of budget to actual shows up
in the file `data/tutorial/4-2-statements-closed/budget.txt`.

For manual analysis of the budget and actuals, use the CSV
file `data/tutorial/4-2-statements-closed/budget.csv` as a 
starting point for work in a spreadsheet.


