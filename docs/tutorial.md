# Hacker Finance Tutorial

## Installing

Total time: 5 minutes or less

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
* (more complicated) changed jobs this year: two w-2s, two retirement accounts
* (more complicated) traded in a car and wants to track the value
  of the new car, including deprecation, retainage and interest on the
  loan.

## Lesson 1: Checking Account

In this lesson we will pretend we have downloaded a year's worth of
transactions for our checking account, and load them into Hacker
Finance.

### Lesson 1A: The Download File

Our "downloaded" file is `tutorial-inputs/tutorial-checking.csv`.  Copy
this file to `open/input`.

Rename the file so that Hacker Finance knows what to do with it.

```
chaseBanking-Checking-2021.csv
```

The first segment of the file name tells Hacker Finance what *transform*
function to use.  We are using the transform for banking account
(checking and savings) from JP Morgan Chase.

>> If you bank with a different institution, you will have to
>> code up a transform.  These are trivial.  Please consider
>> contributing your transform.

The second segment is the name of our account, in this case "Checking".

The third segment is anything you want.  Use the simplest string that
is clear and will make sense if you look at it two years later.  

### Lesson 2A: Run the Process

With our downloaded file in place, let's run the CLI Command:

```bash
ts-node process
```
We should get the following message, telling us that Hacker Finance
is not entirely sure what to do with the transactions in this file:




### Lesson 1C: Teaching Hacker Finance About Repeating Transactions

Hacker Finance is complaining that it has partially-defined accounts
and that it has XXX transactions that are not matched.

We are going to first worry about mapping our transactions, that is,
telling Hacker Finance where they came from or where they are going,
and then later we will take care of all of those complaints about
the Chart of Accounts.


### Lesson 1D: Mapping One-Off Transactions


### Lesson 1E: Small Discussion of Double Entry

When using Hacker Finance, all you have to know about double entry
bookkeeping is that every transaction must link to exactly two
accounts.  There are a few simple ways to think of this:
* If money went into your checking account, where did it come from?
* If money left your checking account, where did it go?
    * did you buy something of value that we need to track?
    * or was it an expense - the money is gone forever

That is the only thing you have to know about double entry when
it comes to Hacker Finance.  Most of the work we do is in
*mapping* transactions from the checking (or savings or credit card)
account to one of:
* an account specifying where the money came from
* an account specifying what the money was used for

### Lesson 1E: Fully Specifying our Accounts

The one master file we maintain in Hacker Finance is the Chart of 
Accounts.  As we have progressed through this batch, Hacker Finance
is complaining on each iteration that we need to tell it about
the "Group" and "Subgroup" for the accounts we have been creating.

But first a word about accounts.  Some accounts in our Chart of Accounts
have 
analogies in the real world.  Our checking "Account" in Hacker 
Finance has exactly the transactions we received from the bank, no more
and no less.  It is an exact representation of a real account  
handled by a third party.

Other "accounts" are just buckets where we track things.  We
have created an account call "Gas" to track our spending on gasoline,
but there is no institution somehwere that is tracking when we spend
money on gas.  It is our own bucket.

The value of Hacker Finance is that you can define any accounts
(buckets) that you want and categorize spending in the way that makes
sense to you.


### Lesson 1F: Checking the Trial Balance


### Lesson 1G: Closing the Batch

### Lesson 1H: Running Financial Statements


### Lesson Conclusion



## Lesson 2: Our Second Batch