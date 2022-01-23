# Hacker Finance Tutorial

## Installing

Step 1: Install ts-node

Step 2: Clone the Repo

Step 3: Run `npm install`

Step 4: run `ts-node first-time`

Step 5: If you are not in the USA, edit `usr/usrConfig.ts`.  Set the
property `localeCurrencySpecifier` to your locale.  Set the property
`localeCurrencyOptions` to the specifics for your currency.  Available
settings can be found in the documentation for Javscript's 
[SetLocaleString() function](https://www.w3schools.com/jsref/jsref_tolocalestring_number.asp).


## What To Expect

We want a tutorial that proceeds from simple cases to more
complex (and more useful) cases.  To achieve this, the tutorial
walks us through a year in the life of J. Random Hacker, who:
* (simple) has only one checking and one savings account 
* (simple) has only one credit card
* (more complicated) wants to record that the value of his
car went down from the beginning of the year to the end.
* (more complicated) changed jobs this year: two w-2s, two retirement accounts

## Lesson 1: Checking Account

In this lesson we will pretend we have downloaded a year's worth of
transactions for our checking account, and load them into Hacker
Finance.

### Lesson 1A: The Download File

Our downloaded file is `tutorial-inputs/tutorial-checking.csv`.  Copy
this file to `open/input`.

Rename the file so that Hacker Finance knows what to do with it.

```
chaseBanking-Checking-2021.csv
```

The first segment of the file name tells Hacker Finance what *transform*
function to use.  We are using the transform for banking account
(checking and savings) from JP Morgan Chase.

> If you bank with a different institution, you will have to
> code up a [transform](/docs/transforms.md).  These are trivial.  Please consider
> contributing your transform.

The second segment is the name of our account.  In this case it
is "Checking".

The third segment is anything you want.  Use the simplest string that
is clear and will make sense if you look at it two years later.  

### Lesson 1B: Run the Process

With our downloaded file in place, let's run the CLI Command:

```bash
ts-node process
```

We should get a set of "to-do" items something like this:

```text
THERE ARE TO-DO ITEMS BEFORE THE BATCH CAN BE CLOSED
To-do items are in  /path/to/HackerFinance/open/to-do.txt
Here they are for handy reference:
 -> 54 transactions are not yet mapped
 -> FYI: map multiple transactions by description in masters/match-by-description.csv
 -> FYI: map indidividual transactions in open/shared/transactionMap.csv
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Checking" will need Group and Subgroup
```

### Lesson 1C: Repeating Transactions

Now we will open up `masters/match-by-description.csv` and teach Hacker 
Finance how to map repeating transactions from now on.  Once we do this
for a repeating transaction, we never need to do it again.

Looking at the top of the file, we see similar descriptions for twelve
transactions:

```csv
Offset,Description
,AllYouCanEat Bonanzaram
,BigTech PID:DD Payroll
,NewJob Payroll ADP AutoDirect
,PYMT ONLINE CAPITAL ONE 01/07
,PYMT ONLINE CAPITAL ONE 02/12
,PYMT ONLINE CAPITAL ONE 03/11
,PYMT ONLINE CAPITAL ONE 04/18
,PYMT ONLINE CAPITAL ONE 05/05
,PYMT ONLINE CAPITAL ONE 06/03
,PYMT ONLINE CAPITAL ONE 07/14
,PYMT ONLINE CAPITAL ONE 08/01
,PYMT ONLINE CAPITAL ONE 09/01
,PYMT ONLINE CAPITAL ONE 10/01
,PYMT ONLINE CAPITAL ONE 11/01
,PYMT ONLINE CAPITAL ONE 12/01
```

We are going to modify the first "PYMNT ONLINE CAPITAL ONE" to remove
the date at the end, and map it to "Payments". Notice we ignore all
of the other description lines.  (Line 5 has been modified)

```
Offset,Description
,AllYouCanEat Bonanzaram
,BigTech PID:DD Payroll
,NewJob Payroll ADP AutoDirect
Payments,PYMT ONLINE CAPITAL ONE
,PYMT ONLINE CAPITAL ONE 02/12
,PYMT ONLINE CAPITAL ONE 03/11
,PYMT ONLINE CAPITAL ONE 04/18
,PYMT ONLINE CAPITAL ONE 05/05
,PYMT ONLINE CAPITAL ONE 06/03
,PYMT ONLINE CAPITAL ONE 07/14
,PYMT ONLINE CAPITAL ONE 08/01
,PYMT ONLINE CAPITAL ONE 09/01
,PYMT ONLINE CAPITAL ONE 10/01
,PYMT ONLINE CAPITAL ONE 11/01
,PYMT ONLINE CAPITAL ONE 12/01
```

There are two things to know here:

> Hacker Finance will now map any transaction that contains
> "PYMT ONLINE CAPITAL ONE" to the account "Payments".  

and:

> We always use the "Payments" account, which is built-in,
> when paying any loans or credit cards.  This is an
> *Exchange* account.  Exchange accounts are explained
> in the [User Guide](/user-guide.md).

Now we run `ts-node process.ts` and we see that the to-do 
list now only says that 42 tranactions are not mapped:

```text
THERE ARE TO-DO ITEMS BEFORE THE BATCH CAN BE CLOSED
To-do items are in  /path/to/HackerFinance/open/to-do.txt
Here they are for handy reference:
 -> 42 transactions are not yet mapped
 -> FYI: map multiple transactions by description in masters/match-by-description.csv
 -> FYI: map indidividual transactions in open/shared/transactionMap.csv
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Checking" will need Group and Subgroup
```

### Lesson 1D: More Repeating Transactions

Taking a glance at `masters/match-by-description.csv` we can see two more 
sets of repeating transactions where the date is included.  Below is
what we would do.

```csv
Offset,Description
,AllYouCanEat Bonanzaram
,BigTech PID:DD Payroll
,NewJob Payroll ADP AutoDirect
,Super Deluxe Multi-Cinema
Transfers,Transfer to Savings ending in 9999
,Transfer to Savings ending in 9999 07/23
,Transfer to Savings ending in 9999 09/23
,Transfer to Savings ending in 9999 11/23
Rent,Zelle Payment To Mr Landlord 
,Zelle Payment To Mr Landlord 02/01
,Zelle Payment To Mr Landlord 03/01
,Zelle Payment To Mr Landlord 04/01
,Zelle Payment To Mr Landlord 05/01
,Zelle Payment To Mr Landlord 06/01
,Zelle Payment To Mr Landlord 07/01
,Zelle Payment To Mr Landlord 08/01
,Zelle Payment To Mr Landlord 09/01
,Zelle Payment To Mr Landlord 10/01
,Zelle Payment To Mr Landlord 11/01
,Zelle Payment To Mr Landlord 12/01
Payments,PYMT ONLINE CAPITAL ONE
```

Modify the first ",Transfer to Savings..." line so it shows as above.
Be sure to remove the date at the end so that Hacker Finance will
forever after map all transfers to J. Random Hacker's savings account
to the "Transfers" account.

> Transfers between checking and savings accounts are 
> always mapped to "Transfers", another built-in account.

Do the same thing for the Zelle rent payments.  Modify only the
first line and remove the date from the description so tha what
is left is the repeating part common to all of these transactions.

Run `ts-node process.ts` again and let's see where we stand:

```text
THERE ARE TO-DO ITEMS BEFORE THE BATCH CAN BE CLOSED
To-do items are in  /path/to/HackerFinance/open/to-do.txt
Here they are for handy reference:
 -> 26 transactions are not yet mapped
 -> FYI: map multiple transactions by description in masters/match-by-description.csv
 -> FYI: map indidividual transactions in open/shared/transactionMap.csv
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Checking" will need Group and Subgroup
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Rent" will need Group and Subgroup
```

In a couple of short steps we have created *permanent* mappings
for three common transactions, and have only 26 transactions left
to map.


### Lesson 1E: Direct Deposit Repeating Transactions

Sometimes repeating transactions all actually have the same
description and we don't have to modify the description.
This is the case for both of the two jobs that J. Random
Hacker held this year, as we can see from our now 
much simpler `masters/match-by-description.csv`.

```csv
Offset,Description
,AllYouCanEat Bonanzaram
,BigTech PID:DD Payroll
,NewJob Payroll ADP AutoDirect
,Super Deluxe Multi-Cinema
Payments,PYMT ONLINE CAPITAL ONE
Rent,Zelle Payment To Mr Landlord
Transfers,Transfer to Savings ending in 9999
```

To map the two sets of payroll transactions, we now get to decide
what to name the accounts for these two jobs.  We could make it
simple and just name them "Salary", but we will have more detailed
reports if we assign them into two separate accounts.

Let's choose the names `TakeHome/BigTech` and `TakeHome/NewJob` for
the two accounts.

> Notice we did not use the term "Salary" in the name.  This is
> because this amount is not actually J. Random Hacker's salary,
> it is only the portion that got taken home after deductions.
> Later in the tutorial we can calculate the total salary when
> we do a manual batch from the W-2's from the two jobs.

Modify the description map to look like this:

```csv
Offset,Description
,AllYouCanEat Bonanzaram
TakeHome/BigTech,BigTech PID:DD Payroll
TakeHome/NewJob,NewJob Payroll ADP AutoDirect
,Super Deluxe Multi-Cinema
Payments,PYMT ONLINE CAPITAL ONE
Rent,Zelle Payment To Mr Landlord
Transfers,Transfer to Savings ending in 9999

```

Then, as always, run `ts-node process` and it now reports there
are only two transactions not yet mapped.

### Lesson 1F: Mapping Individual Transactions

With only two transaction left, and we will map them individually.
Open `open/shared/transactionMap.csv`, and look at the unmapped
transactions, which are at the top:

```csv
Offset,Source,Date,Amount,Description
,Checking,20210501,5547,Super Deluxe Multi-Cinema
,Checking,20210715,19814,AllYouCanEat Bonanzaram
```

Just like the description map, we add our mappings right at the
front of the line.

Here we get to name the expense accounts anyhing we like, so
let's use "GoingOut" and "Dining", and produce this:

```csv
Offset,Source,Date,Amount,Description
GoingOut,Checking,20210501,5547,Super Deluxe Multi-Cinema
Dining,Checking,20210715,19814,AllYouCanEat Bonanzaram

```

Finally we run `ts-node process` and see that it is no longer telling
us there are unmapped transactions, but it is telling us that a bunch
of accounts need a "Group" and "Subgroup".

```
THERE ARE TO-DO ITEMS BEFORE THE BATCH CAN BE CLOSED
To-do items are in  /path/to/HackerFinance/open/to-do.txt
Here they are for handy reference:
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,TakeHome/BigTech" will need Group and Subgroup
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Checking" will need Group and Subgroup
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,TakeHome/NewJob" will need Group and Subgroup
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Rent" will need Group and Subgroup
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,GoingOut" will need Group and Subgroup
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Dining" will need Group and Subgroup
```


> In a real scenario, a year out of a checking account will have
> hundreds and, more likely, thousands of transactions.  The
> motivating idea behind Hacker Finance was to use descriptions
> most of the time for repeating transactions, while allowing
> the individual mapping of one-offs, attempting to balance
> automation with control.

### Lesson 1G: Assigning Groups to our Accounts

Now we have to tell Hacker Finance a little more about the accounts
we have been cheerfully making up as we go along: TakeHome/BigTech,
Checking, Rent, and so forth.

We will fill out the details in `masters/chart-of-accounts.csv`, which
right now looks like this:

```csv
Group,Subgroup,Account
,,Checking
,,Dining
,,GoingOut
,,Rent
,,TakeHome/BigTech
,,TakeHome/NewJob
Equity,Exchange,Payments
Equity,Exchange,Transfers
```

> Notice the two built-in accounts are already there: 
> Equity,Exchange,Payments, and Equity,Exchange,Transfers.
> Those were added when we ran `ts-node first-time.ts`.

The first column is the Group, and it must be one of the five
standard groupings of accounts in double-entry bookkeeping,
which are Asset, Liability, Equity, Income, and Expense.

Each of these has precise meanings in bookkeeping, but we can
use very informal definitions as they apply to Hacker Finance:

* Asset: my stuff 
* Liability: money I owe
* Equity: everything I owned before I started using Hacker Finance
* Income: money coming in
* Expense: money going out or value lost
  * Except payments to loans or credit cards, they go to 'Payments'
  * Except transfers between my accounts, they go to 'Transfers'
  * Except major purchases whose value I retain, like a car or 
    real esate, we will see those later
  * Value going out is *non-cash expenses*, which usually means
    depreciation, we will see that later.
  * Value going out can also mean losses due to theft (ask me how I know)

So hopefully it should be clear that our accounts naturally fall
out this way:

```csv
Group,Subgroup,Account
Asset,,Checking
Expense,,Dining
Expense,,GoingOut
Expense,,Rent
Income,,TakeHome/BigTech
Income,,TakeHome/NewJob
Equity,Exchange,Payments
Equity,Exchange,Transfers
```

But we are not finished, we must supply the middle values, which are
explained next.

### Lesson 1H: Assigning Subgroups

The real feature of Hacker Finance is control of how you map
your transactions.  Hacker Finance breaks everything down into
three levels:

* Group - as described above, follows generally accepted accounting principles
* Subgroup - we get to name these anything we want
* Account - we get to name these anything we want

So what do we do with "Dining" and "GoingOut"?  When you complete
the tutorial and run your own transactions, you can call them
anything you like, but just to keep moving here we will call them
"Lifestyle", and so we have this so far:

```csv
Group,Subgroup,Account
Asset,,Checking
Expense,Lifestyle,Dining
Expense,Lifestyle,GoingOut
Expense,,Rent
Income,,TakeHome/BigTech
Income,,TakeHome/NewJob
Equity,Exchange,Payments
Equity,Exchange,Transfers
```

Now let's hit Checking.  Here we also have guidance from generally
accepted account practice, which is to use the Subgroup "Cash".  This
distinguishes liquid cash assets from less liquid assets we will
add later into subgroups like "Vehicles" and "Retirement" or
"RealEstate".

> Hacker Finance does allow spaces in account names and subgroup name, but in
> this tutorial we stick with WordCase.

For "Rent" let's just put this in "Residence".  In a real-life scenario
we would have in Residence additional expenses like Insurance, Utilities
and anything else you want to group in any way you want.

So we now have this:

```csv
Group,Subgroup,Account
Asset,Cash,Checking
Expense,Lifestyle,Dining
Expense,Lifestyle,GoingOut
Expense,Residence,Rent
Income,,TakeHome/BigTech
Income,,TakeHome/NewJob
Equity,Exchange,Payments
Equity,Exchange,Transfers

```

Finally we have our income.  A good practice is to use the subgroup
"W2" for any income that gets reported on a W2.  By the same idea you
can have a group called "1099" (in the USA that is for self-employment).
Plus of course income from capital gains, growth of retirement accounts
and pension funds, dividends, and really anything else that applies.

Because J. Random Hacker is in the USA and had two regular salaried
positions, we will put his take home pay in the "W2" subgroup, and
now we are done with the Chart of Accounts:

```csv
Group,Subgroup,Account
Asset,Cash,Checking
Expense,Lifestyle,Dining
Expense,Lifestyle,GoingOut
Expense,Residence,Rent
Income,W2,TakeHome/BigTech
Income,W2,TakeHome/NewJob
Equity,Exchange,Payments
Equity,Exchange,Transfers
```

Now when we run `ts-node process.ts`, lo and behold, it tells us the
batch is ready to go:

```
     ! There are no To-Do items !
     You can view statements in: open/reports/
     If you like the statements, close the batch by running 'ts-node close'
```

But we are not ready to close the batch, because now we have to review
it, and learn a simple and easy approach to what can be very intimidating:
Debits and Credits.

### Lesson 1J: First Review of The Trial Balance

When Hacker Finance sees there are no to-do items, it runs a complete
set of statements for the batch, and puts them in `open/reports/`.
We are going to start with the Trial Balance Level 0, which rolls 
everything up to the Group level.  It should look like this:

```text
Trial Balance Level 0

Group                Debits        Credits Min Date   Max Date   Trx Count
------------ -------------- -------------- ---------- ---------- ---------
Asset            $22,587.91                2021-01-01 2021-12-15        54
Liability                                  9999-99-99 0000-00-00         0
Equity            $1,800.00                2021-01-07 2021-12-01        16
Income                          $39,041.52 2021-01-01 2021-12-15        24
Expense          $14,653.61                2021-01-01 2021-12-01        14
------------ -------------- -------------- ---------- ---------- ---------
```

Debits and Credits can be very intimidating, but we take a very practical
approach to them.  Think of this way:

* Start with Assets.  A debit to an asset means you got something, money
  came in, or your real estate holdings went up.  A *debit balance* for
  Assets in a batch means more money came in than went out for the batch.
* Income is the opposite of Assets.  A credit to an income account means
  that money came in.  

> Here we see the basics of double entry bookkeeping, which is that all
>  debits must match all credits.  If you *debit checking* with 1500.00
>  because you got paid, you must have a 1500.00 credit somewhere.  That
> somewhere is an Income account.  Ergo, Debits to Assets mean
> "I got something", and Credits to Income are the mirror image,
> "Somebody gave me something."

* From here, it stands to reason that, as Expenses are the opposite
  of income, a debit balance in the Expense group suggests we spent
  money.
* By the same logic, if a debit balance in Assets means "I have
  something", then a credit balance in Liabilities means
  "I owe something".
* Equity we will see later.

So the trial balance is *in balance*, all debits equal all credits,
but actually something is wrong.  We will fix it in the next lesson.

> If you are curious about the Equity Debits of 1800, these are
> there because we have recorded payments to the credit card
> and transfers to the savings account, but we have not yet 
> recorded anything for the savings account or credit card.
> The Equity debits tell us that *within this batch* there is
> 1800.00 worth of payments and transfers to other accounts that still need
> to be added (in other batches) to those accounts.  Because Hacker
> Finance goes one account at a time, you almost always have an
> Equity-Exchange balance *within a batch*, but if you process
> all of your accounts, this balance disappears on the main
> statements.

### Lesson 1K: Add Checking Account Begin Balance

The problem is one that we have so far not talked about, the 
*beginning balance* for the checking account.  Because we only
downloaded transactions, but never told Hacker Finance about the
beginning balance, it is reporting the *sum of the transactions*
as if it is the final balance.  If we close this batch now,
the balance of the checking account in the permanent ledger will
be wrong.

So let's pretend J. Random Hacker went onto his bank's website
and learned that:
* On December 31st of 2020 his checking balance was 1000.00
* On December 31st of 2021 his checking balance was 23,587.91

The first time we load an account to Hacker Finance, we need to
tell it what the starting balance is.  After that, since it already
knows, it should always come up with the correct balance because
it simply sums the transactions.

So we do something radical, we just go add a transaction to the
file we downloaded.  At line 2 to our download like this:

```csv
Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #
x,12/31/2020,"Manually Added Begin Balance",1000.00,x,0,
x,01/01/2021,"BigTech PID:DD Payroll",1534.23,X,0,
```

> You may notice blanks and little 'x' marks in the input.  In a
> real download file from JP Morgan Chase the 'x' marks will have
> other values, but Hacker Finance does not need them, so in the
> tutorial I just typed in a bunch of little 'x' marks.  We also
> don't need to give them any meaningful values when we add them
> in manually.

Save the file, run `ts-node process`, and it will tell us we have
one transaction that is not mapped.

We hop over to `open/shared/transactionMap.csv` and map the new
transaction to something called `BeginBalances` like so:

```csv
Offset,Source,Date,Amount,Description
BeginBalances,Checking,20201231,100000,Manually Added Begin Balance
```

Yet again we run `ts-node process` so it can pick up the change, and
it will ask us to specify what `BeginBalances` is.

```
THERE ARE TO-DO ITEMS BEFORE THE BATCH CAN BE CLOSED
To-do items are in  /path/to/HackerFinance/open/to-do.txt
Here they are for handy reference:
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,BeginBalances" will need Group and Subgroup
```

Now finally we can talk about Equity, specifically *retained*
value.  To avoid a lengthy discourse,
we are going with the practical idea that "BeginBalances" is exactly
what it says, the balances of our accounts on the day before we
started loading transactions to Hacker Finance.  So we put this into
Equity-Retained, which we will call for now, "Stuff I had before I started
using Hacker Finance."

Our chart of Accounts should now look like this:

```csv
Group,Subgroup,Account
Equity,Retained,BeginBalances
Asset,Cash,Checking
Equity,Exchange,Payments
Equity,Exchange,Transfers
Expense,Lifestyle,Dining
Expense,Lifestyle,GoingOut
Expense,Residence,Rent
Income,W2,TakeHome/BigTech
Income,W2,TakeHome/NewJob
```

### Lesson 1L: Final Review of the Trial Balance

Now the trial balance is really starting to be useful, by looking at it
we can see a few things:

```text
Trial Balance Level 0

Group                Debits        Credits Min Date   Max Date   Trx Count
------------ -------------- -------------- ---------- ---------- ---------
Asset            $23,587.91                2020-12-31 2021-12-15        55
Liability                                  9999-99-99 0000-00-00         0
Equity              $800.00                2020-12-31 2021-12-01        17
Income                          $39,041.52 2021-01-01 2021-12-15        24
Expense          $14,653.61                2021-01-01 2021-12-01        14
------------ -------------- -------------- ---------- ---------- ---------
```

First, we have a correct bank balance.  We have *reconciled* the checking
account and can trust what Hacker Finance tells us about its balance.

We now can see that J. Random Hacker's total take home pay in the year
was 39,041.52 from both jobs.

Finally, we can see that J. Random Hacker's total expenses (out of his
checking account) were 14,653.61.  

Now that the batch is *reconciled* to reality (the beginning balance),
we can close the batch.

### Lesson 1M: Close the Batch

Run `ts-node close`.  It runs a few more checks to make sure everything is
ok, and then it should tell you this:

```text
Copying From/To open/input/chaseBanking-Checking-2021.csv closed/inputs/chaseBanking-Checking-2021.csv
Copying From/To open/ledger/ledger.json closed/ledgers/chaseBanking-Checking-2021.json

All done, the batch is closed.  You can run `ts-node statements` now
```

## Lesson 2: The Savings Account

The savings account is much simpler than the checking account.  So this
lesson will be very brief and go through it in one pass.

First we pretend that J. Random Hacker has gone onto his bank's website
and determined that his Savings balance was 5000.00 at the end of 2020,
and 5600.00 at the end of 2021.

Next we delete the current input file in the `open/input` directory,
as we have closed that batch.  Hacker Finance cowardly refuses to delete
files, and wants you to do it yourself when you are ready.

Next we copy the file `tutorials/tutorial-savings.csv` into
`open/input` and rename it according to the Hacker Finance convention.

```
chaseBanking-Savings-2021.csv
```

The first segment 'chaseBanking' tells us what transform to use when
loading it.  The second names the account, 'Savings'.  The third is
anything that we will remember when we look at it 2 years from now.

Next we edit the input file and add the begin balance, so the file
should look like this after editing:

```csv
Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #
x,12/31/2020,"Mannually Added Begin Balance",5000.00,x,0,
x,05/23/2021,"Transfer from Checking ending in 9999 05/23",150.00,x,0,
x,07/23/2021,"Transfer from Checking ending in 9999 07/23",150.00,x,0,
x,09/23/2021,"Transfer from Checking ending in 9999 09/23",150.00,x,0,
x,11/23/2021,"Transfer from Checking ending in 9999 11/23",150.00,x,0,
```

Save the file and run `ts-node process`.  It tells us we have 5 transactions
that are unmapped:

```text
THERE ARE TO-DO ITEMS BEFORE THE BATCH CAN BE CLOSED
To-do items are in  /path/to/HackerFinance/open/to-do.txt
Here they are for handy reference:
 -> 5 transactions are not yet mapped
 -> FYI: map multiple transactions by description in masters/match-by-description.csv
 -> FYI: map indidividual transactions in open/shared/transactionMap.csv
 -> Chart of accounts: masters/chart-of-accounts.csv
    Account ",,Savings" will need Group and Subgroup
```

So we jump into our trusty description map at `masters/match-by-description.csv`
and create a permanent map of transfers in from the Checking account (line 3
is what we modify):

```csv
Offset,Description
,Mannually Added Begin Balance
Transfers,Transfer from Checking ending in 9999
,Transfer from Checking ending in 9999 07/23
,Transfer from Checking ending in 9999 09/23
,Transfer from Checking ending in 9999 11/23
```

Running `ts-node process` again now tells us there is only transaction, so
we map it directly by going to `open/shared/transactionMap.csv` and adding
'BeginBalances' at the beginning of the first line:

```csv
Offset,Source,Date,Amount,Description
BeginBalances,Savings,20201231,500000,Mannually Added Begin Balance
```

When we run `ts-node process` again to process this, it only needs us to
tell us the Group and Subgroup of "Savings".  Since this is an Asset
Cash account, just like checking, we modify the first line
of `masters/chart-of-accounts.csv` to look like this:

```
Group,Subgroup,Account
Asset,Cash,Savings
```

Running `ts-node process` one last time says there are no to-do items,
but we know we must check the trial balance in case we mis-typed anything.
If we typed everything correctly, the batch trial balance at
`open/reports/trial-balance-0.txt` will look exactly like this:

```text
Trial Balance Level 0

Group                Debits        Credits Min Date   Max Date   Trx Count
------------ -------------- -------------- ---------- ---------- ---------
Asset             $5,600.00                2020-12-31 2021-11-23         5
Liability                                  9999-99-99 0000-00-00         0
Equity                           $5,600.00 2020-12-31 2021-11-23         5
Income                                     9999-99-99 0000-00-00         0
Expense                                    9999-99-99 0000-00-00         0
------------ -------------- -------------- ---------- ---------- ---------
```

This is good!  The Savings balance is *reconciled* to reality: it is
5600.00 as the bank's website told us.  We are ready to close the batch.

Run `ts-node close`.

## Lesson 3: Main Statements

Now that we have closed two batches, our main financial statements
will being to reflect reality more closely.

Run `ts-node statements` to run statements out of the combined ledgers
of all closed batches.

Let's look at the Income Statement, level 1, found at
`closed/reports-income-sttement-1.txt`.  We should see this:

```text
Income Statement Level 1

Income Accounts
Subgroup                Debits        Credits Min Date   Max Date   Trx Count
--------------- -------------- -------------- ---------- ---------- ---------
W2                                 $39,041.52 2021-01-01 2021-12-15        24
--------------- -------------- -------------- ---------- ---------- ---------
                                   $39,041.52

Expense Accounts
Subgroup                Debits        Credits Min Date   Max Date   Trx Count
--------------- -------------- -------------- ---------- ---------- ---------
Residence           $14,400.00                2021-01-01 2021-12-01        12
Lifestyle              $253.61                2021-05-01 2021-07-15         2
--------------- -------------- -------------- ---------- ---------- ---------
                    $14,653.61               


--------------- -------------- -------------- ---------- ---------- ---------
                                   $24,387.91
```

At level 1 all individual accounts are rolled up to the Subgroup level,
so we see "W2" income as combined from both jobs at 39,041.52.

In this simple tutorial, J. Random Hacker does not seem to spend much money,
so his expenses fall into only two categories, Residence and Lifestyle.

The "bottom line" of the Income Statement shows us income less expense
for the year, which is J. Random Hacker's change in net worth for the year.

An income statement basically shows money coming in and going out, with the
difference being either your gain of net worth or your loss of net worth,
depending on whether you spent more or less than you brought in.

The balance sheet is a bit different.  The balance sheet shows the total
of what you have and what you owe at the end of the year, after all 
transactions have been tallied up.  Our balance sheet for J Random 
Hacker is not quite complete yet, as we have not added a credit card,
but it is getting closer:

```
Balance Sheet Level 1

Asset Accounts 
Subgroup                Debits        Credits Min Date   Max Date   Trx Count
--------------- -------------- -------------- ---------- ---------- ---------
Cash                $29,187.91                2020-12-31 2021-12-15        60
--------------- -------------- -------------- ---------- ---------- ---------
                    $29,187.91               

Liability Accounts
Subgroup                Debits        Credits Min Date   Max Date   Trx Count
--------------- -------------- -------------- ---------- ---------- ---------
--------------- -------------- -------------- ---------- ---------- ---------
                                             

Equity Accounts
Subgroup                Debits        Credits Min Date   Max Date   Trx Count
--------------- -------------- -------------- ---------- ---------- ---------
Retained                            $6,000.00 2020-12-31 2020-12-31         2
Exchange             $1,200.00                2021-01-07 2021-12-01        20
--------------- -------------- -------------- ---------- ---------- ---------
                                    $4,800.00


--------------- -------------- -------------- ---------- ---------- ---------
                    $24,387.91               
```

Notice that on the Balance Sheet the change in net worth is on the
debit side. 

Take note of the Equity accounts.  The "Retained" subgroup we are using to
mean "What I had before I started using Hacker Finance."  For J Random
Hacker it looks good, it reflects the 5000.00 in savings and the 1000.00
in checking that were there at the end of 2020.

The "Exchange" subgroup shows a Debit Balance of 1200.00, reflecting the
fact that we recording 1200.00 worth of payments out of checking to the
credit card, but we have not run a batch on the credit card yet so the
corresponding transactions, being missing, are not zero-ing out the
Exchange subgroup.

## Lesson 3: The Credit Card

Like the savings account, the credit card account is over-simplified,
as we learned most of what we need to know when processing the checking
account.

Try to finish out the last downloaded file on your own by following
these steps:
* Assume a begin balance of 2000 on 12/31/2020
* delete the current input file
* Copy `tutorials/tutorial-creditcard.csv` to `open/input`
* Rename to use the capOneCC transform, and give it a name like `CapOne9999`,
   so it reminds us this is a Capital One Credit card with number ending
   in 9999.
* Add a transaction for the begin balance of 2000 (Note that Capital One 
  records your payments in the "credit" column, and your spending in
  the "debit" column.  All numbers are positive.  So a begin balance would
  go in the "debit" column.  (Don't try to align this use of debit/credit
  with our use on our financial statements, that way lies madness.)  Note also
  we leave the first column "Transaction Date" blank, because we use the
  second date, "Posted Date". 

* Run `ts-node process` as needed to:
    * Map the transactions to "Payments"
    * Map transactions to "InterestCC"
    * Map the begin balance to "BeginBalances" 
    * Specify CapOne99 as "Liability-Revolving-CapOne99"
    * Specify InterestCC as "Expense-Revolving-InterestCC" 
* Close the batch

If you then run `ts-node statements` the summary trial balance (leve 0)
should be exactly this:

```text
Trial Balance Level 0

Group                Debits        Credits Min Date   Max Date   Trx Count
------------ -------------- -------------- ---------- ---------- ---------
Asset            $29,187.91                2020-12-31 2021-12-15        60
Liability                        $1,010.96 2021-01-05 2021-21-05        25
Equity                           $4,000.00 2020-12-31 2021-12-31        35
Income                          $39,041.52 2021-01-01 2021-12-15        24
Expense          $14,864.57                2021-01-01 2021-21-05        26
------------ -------------- -------------- ---------- ---------- ---------
```

This is now a realistic picture of J Random Hackers finances for the
year (understanding of course the tutorial files have far fewer transactions
that a real live person would).

## Intermission: Debits and Credits

We are about to enter two manual batches, and when we do it will
be time to name the *Debit Account* and *Credit Account* for each
transaction in the batch.

This is very easy if you take a practical approach.  Remember only
two things and you can figure out the rest, and after practice it
becomes second nature.  The two things are:

> If I got/have something, I debit an asset account
> Every debit has a matching credit

If money came to me, I debit the asset account "Checking".  If
somebody gives me a car, I debit the asset account "Vehicles".
If I buy a car, I *still* debit the asset account "Vehicles."

The only principle of double-entry bookeeping we need to know is
that every debit has to have a matching credit.  So:

* If money came to me as salary, I debit the asset account
  "Checking", then I credit the source account: "Salary".
  Or, as we did it in this tutorial, "TakeHome".
* If I bought a car, I debit the asset account
  "Vehicles", because the value of my vehicles went up by
  the purchase price.  The credit is whereever the money
  came from to buy the car:
  * If I paid cash, I credit "Checking"
  * If I financed the entire thing, I credit "AutoLoans"

All other debits and credits can be deduced from there.

## Lesson 4: Booking The Automobile

Now we will see a simple manual batch - entering transactions that
were not downloaded, and which add to the complete picture of 
J Random Hacker's financial life.

Our goals are to record the following facts:
* At the beginning of 2021 J Random Hacker owned an automobile,
  and the trade-in book value at the beginning of the year
  was 10,000.
* At the end of 2021 the car had *depreciated*, its trade-in
  book value had dropped to 8000.

To record these facts, we will open a manual batch:

```bash
ts-node open-manual
```

This creates a file `open/input/manual-x-x.csv`, which we need
to rename.  Like every input file, the first segment must name the
transform, which is `manual`, but we can name the other two anything
that makes sense that we're likely to remember when we see it two
years from now, so we'll name it `open/input/manual-auto-2021.csv`

We only need two transactions, and to enter them we need to know
two bookeeping ideas.

First, the value at the beginning of the year, 10,000, is an
Asset value.  It is something owned by J Random Hacker.  But
every transaction must name two accounts, so the offset is the
same as the initial bank balances, it is the "BeginBalances"
account, which is the account for *everything I owned before
I started using Hacker Finance*.  

In a manual batch we specify both the first account and the matching
account together.  We also grow up a bit and name the first account
the "Debit Account."  Remember the rule that "If I got/have something,
I debit an Asset", and we can work out the transaction as:

```csv
Debit Account,Date,Amount,Credit Account,Description
Vehicles,2021-01-01,10000,InitialBalances,Manually Entered Trade-in Book Value
```

In a second line we want to record that the value of the "Vehicles"
account dropped to 8000 (went down by 2000) by the end of the year,
so we know at 
least it will start off like this:

```csv
Debit Account,Date,Amount,Credit Account,Description
Vehicles,2021-01-01,10000,InitialBalances,Manually Entered Trade-in Book Value
Vehicles,2021-12-31,-2000
```

A vehicle is an asset whose market value predictably goes down the longer
you own it.  That reduction in value is called *depreciation*.  
Depreciation is also called a non-cash expense.  It is an expense
because it reduced your net worth.  It is non-cash because your net
worth went down but you did not spend any money.  So we will
finish the line as:

```csv
Debit Account,Date,Amount,Credit Account,Description
Vehicles,2021-01-01,10000,InitialBalances,Manually Entered Trade-in Book Value
Vehicles,2021-12-31,-2000,Depreciation,Manually Entered Auto Depreciation
```

When we run `ts-node process` we find that Hacker Finance is not telling
us to match any transactions - which makes sense because we put the
matching accounts directly into the input file.  But it does need us to
finish off the the Group and Subgroup for the two new accounts
we created.

We know "Vehicles" is an asset account - something we own.  We already
have a Subgroup "Cash" for bank accounts, so we need a Subgroup for
non-cash property like vehicles and real estate.  Why not just call
it "Property"?  This gives us:

```csv
Group,Subgroup,Account
,,Depreciation
Asset,Property,Vehicles
```

We know depreciation is an Expense, because it is a loss of 
value.  But what Subgroup should it go into?  Why not just use the
same Subgroup as we did for the asset, which is Property?  

> Note: Account values must be unique, but Subgroups do not
> have to be unique.  So you can only have one account in
> the entire system named "Depreciation" or "Entertainment",
> but you can have "Property" as a subgroup in each of the
> five groups (if it makes sense to your needs)

So we get:

```csv
Group,Subgroup,Account
Expense,Property,Depreciation
Asset,Property,Vehicles
```

When we run `ts-node process` Hacker Finance will tell us it is
ready to close the batch.  Take a look at the statements if you
like and close the batch when you are satisfied with them.

## Lesson 5: Year End Paycheck Information

Now we get to the last lesson (at least until I write the
year-end closing routine, then that will become the last
lesson).  This is another manual batch, and really demonstrates
why I wrote Hacker Finance.

In this tutorial we have seen the major features that motivated
me to write this code for my own use:
* Real financial statements: Balance Sheet and Income Statement 
* Hacker-friendly way to automate repeating transactions
* Hacker-friendly control over specific transactions
* Hacker-friendly once-a-year batches for things like retirement accounts,
  real estate, taxes, vehicles and depreciation.

This last lesson is one of those year-end batches that takes five
minutes to enter but really increases the completeness of the
records and therefore increases the value of the whole exercise.

If you go to a financial advisor or planner, they will usually
ask you a trick question.  They ask, "What is your largest expense?"
Most people answer, "Uh, My residence I suppose."  Then they zing
you.  "Wrong!  Taxes!  Taxes are your largest expense.  If you
do not have a strategy to mitigate your tax burden you are not
in control of your expenses!"

So in this final lesson we see how to make J Random Hacker's tax
burden completely visible in black-and-white, using numbers I
totally made up and vastly oversimplified.

In previous lessons we recorded take home pay from Job # 2
totalling $20,630.76.  Now we want to add in the rest of it:

* All federal taxes withheld came to a nice round total of 4000.00
* All state taxes withheld came to a nice round total of 1500.00
* There were a total of 1200.00 deducted for medical insurance
* There was a total of 8000.00 contributed to retirement accounts

So we can do this is four entries in a manual batch.  We start
by running

```
ts-node open-manual.ts
```

Rename the created file `manual-x-x.csv` to `manual-NewJob-2021_YearEnd.csv`.

In a manual batch we are responsible for knowing about debits
and credits, so we remember the rule:

> If I got/have something, I debit an asset account
> Every debit has a matching credit

The easiest place to start is the 8000.00 contributed to the retirement
account, that is something "I got/have" so we will debit an asset
account.  We start the first line like this:

```
Debit Account,Date,Amount,Credit Account,Description
401k/NewJob,2021-12-31,8000.00,????
```

The credit account will be "Withheld/NewJob", meaning all of the money
paid in salary that did not go home, which finishes the line:

```
Debit Account,Date,Amount,Credit Account,Description
401k/NewJob,2021-12-31,8000.00,Withheld/NewJob,Manual Sum 401k 2021
```

It should hopefully be clear that all of our transactions will have
the same credit account, "Withheld/NewJob", because all of them are money
paid in salary that went somewhere else instead of going home.

As we get to make up any names we want for our accounts, we will make
up descriptive names for Federal taxes, state taxes, and medical
insurance, giving:

```
Debit Account,Date,Amount,Credit Account,Description
401k/NewJob,2021-12-31,8000.00,Withheld/NewJob,Manual Sum 401k 2021
Fed2021,2021-12-31,4000.00,Withheld/NewJob,Manual Sum 401k 2021
State2021,2021-12-31,1500.00,Withheld/NewJob,Manual Sum 401k 2021
Insurance/Med,2021-12-31,1200.00,Withheld/NewJob,Manual Sum 401k 2021
```

After we run `ts-node process` Hacker Finance needs us to specify
the Group and Subgroups for the new accounts we have created.  We
can figure that:
* Withheld/New Job is an Income account in group W2, just like
  the two TakeHome accounts we made up.
* 401k/NewJob is an Asset account of type "Qualified", where
  "Qualified" is a technical term that I will simply here to
  mean retirement accounts covered by certain tax laws.
* Both "Fed2021" and "State2021" are Expense accounts in
  Subgroup Taxes
* Finally "Insurance/Med" is an expense account.  We will
  make up the Subgroup Health, on the idea that we may also
  have Dental, Vision, and so forth in that group.

This means we'll clean up the Chart of Accounts so the new
accounts look like this:

```csv
iGroup,Subgroup,Account
Asset,Qualified,401k/NewJob
Expense,Taxes,Fed2021
Expense,Health,Insurance/Med
Expense,Taxes,State2021
Income,W2,Withheld/NewJob
```

We should be able to run these three commands in a row:

```bash
ts-node process
ts-node close
ts-node statements
```

To wrap it up, the final benefit is having all expenses represented,
which can be seen on the Level 2 Income Statement (most detailed):

```
Group           Subgroup        Account                 Debits 
--------------- --------------- --------------- -------------- 
Expense         Revolving       InterestCC             $210.96 
Expense         Residence       Rent                $14,400.00 
Expense         Lifestyle       Dining                 $198.14 
Expense         Lifestyle       GoingOut                $55.47 
Expense         Taxes           Fed2021              $4,000.00
Expense         Taxes           State2021            $1,500.00
Expense         Health          Insurance/Med        $1,200.00 
Expense         Property        Depreciation         $2,000.00
--------------- --------------- --------------- --------------
                                                    $23,564.57               

```

## Final Comments

If you'd like to continue practicing before going at it with your
own data, here are some suggestions:
* Make up a fake final paycheck for J Random Hacker's job from
  the first half of the year
* Make up a fake year-end statement for each of the retirement
  accounts (one from each job), including
  * Balance at beginning of 2021
  * Contributions from J Random Hacker
  * Contributions from employer
  * Gains/Loss
  * Fees
* Add some real estate
* Add some 1099 (self-employment) income 
