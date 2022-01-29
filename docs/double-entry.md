# A Quick Introduction To Double Entry Bookkeeping

Double entry bookeeping requires two pieces of information
whenever money moves:
1. Where did it come from
2. Where did it go

The statement "I deposited 1000.00 into my checking account"
is not a valid double-entry statement, because it only states
the destination.  A valid version would be "I deposited
my paycheck of 1000.00 into my checking account", or 
"I deposited a gift of 1000.00 into my checking account."

The places money moves to and from are called *Accounts*.  The
list of all sources and destinations of interest is called the
*Chart of Accounts*.  Some accounts are tied to a real-world
financial institution like your checking account.  Other
accounts are "virtual", like an account tracking spending
on rent, or an account tracking the value of your vehicles.

So our 1000.00 deposit to checking from a paycheck can be
expressed in terms of accounts as:
* Account "Checking" received 1000.00
* Account "Paycheck" provided 1000.00

By standard accounting rules accounts are grouped.  The
five conventional groups are:
* Asset - stuff I own
* Liability - stuff I owe
* Equity - [explained here](equity.md)
* Income - sources of money
* Expense - reasons to spend money

Hacker Finance uses a fixed 3-level structure in its Chart
of Accounts.  The three levels are:
* Group - one of the five groups listed above
* Subgroup - anything you want to further divide the groups
* Account - anything you want (must be unique)

Continuing with our deposit of a 1000.00 paycheck into
Checking, we can fully specify the checking account as:
* An asset, it's something I own
* It's cash, as opposed to property or a retirement account
* It's the "Checking" account, in contrast to a savings account

As for the Paycheck:
* An Income account, it is a source of money
* A Salaried income account, it is money from a job, as oppposed
  to gifts, inheritance, dividends, interest, or self-employment
* A specific job, like "BigTech", the corporation that employes me

So our double-entry statement is now further refined to:
* Account "Asset - Cash - Checking" received 1000.00
* Account "Income - Salaried - BigTech" provided 1000.00

Bookkeepers do not use terms like "received" or "provided", they
use the two terms "debit" and "credit".  In keeping your books,
do not try to map the terms debit and credit to any use of those
terms in the wider world, like "debit card."  They don't match.
Just start with a blank slate.

By convention, if money goes into an asset, it is a *debit*.  Every
debit must have a matching credit, so our final refinement of
our statement about the 1000.00 paycheck is:
* We will debit account "Asset - Cash - Checking" for 1000.00
* We will credit account "Income - Salaried - BigTech" for 1000.00

We now have a complete and valid statement in terms that any
bookkeeper would understand and approve.

Remembering that *debits to assets means money went in*, and that
every debit has a matching credit, we can read financial 
statements by deducing:

* A debit balance in an asset account means I've got something:
  cash, a balance in my retirement account, a vehicle worth so
  much, real estate worth so much, and so forth.
* A liability balance, being the opposite of an asset, must
  show up in the credit column
* An income balance, being the opposite of an asset, must
  show up in the credit column
* An expense balance, being the opposite of Income, must show
  up in the debit column.
* Equity (not explained here) is the opposite of an Asset,
  shows up in the credit column.
