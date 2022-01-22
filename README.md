# Hacker Finance

## The Premise

Modern personal finance sites and apps do three things for you:
* Connect to your financial institutions and import your transactions
* Automatically map those transactions into buckets like "Gas", "Lodging"
  and "Entertainment".  
* Show colorful charts detailing your expenses

When I tried to use a few of these apps I found I always ended up
spending most of my time in a clumsy UI trying to fix the mappings into
categories that are more useful to me.

So it occurred to me that if I were going to spend that time on the
mapping, I'd rather do it in a code editor, and 
as I don't need the colorful charts and can code up financial
statements, I would just do it myself.  The result is Hacker Finance.

## It's Not For You If...

If you are happy with the way that mainstream apps categorize
your transactions then you probably do not want to use Hacker Finance, as
Hacker Finance makes you do all of that work yourself.  Hacker Finance
assumes you *want* to do that work to get the correct mappings for your
personal purposes.

## It Might Be For You If...

Hacker Finance attempts to provide an optimized solution to the
problem of personal finance under the following conditions:
* The user is not satisfied with the ability of free/cheap
  personal finance apps to categorize their transactions
* The user wishes to have a complete picture of their finances
  including, if desired, taxes, vehicles, depreciation, real estate
  and so on
* The user is a hacker:
    * expects full control of their data
    * is fine with downloading some files from their bank
    * is comfortable with a CLI
    * is comfortable (and probably prefers) working in a code editor
    * will learn a few bookkeeping ideas for the fun of it and
      because it helps get the job done

## Features

Hacker Finance has these features:

* Three standard statement, each at three levels of detail:
  * Balance Sheet
  * Income Statement
  * Trial Balance
  * Complete transaction dump
* Currency format on statement is user-specified (en-US default)
* One master file: the chart of accounts
* A batch system for importing your transactions
  * Remembers recurring transactions
  * Allows direct mapping of one-time transactions

Features I will probably get around to:
* Date-filtered statements
* Year-end rollup 
* (maybe someday) nice HTML reports

## Learn By Following the Tutorial

Everything is in [The tutorial](docs/tutorial.md).

## Learn Without the Tutorial

If you want to dive in, here is what you need to know.

Hacker Finance is a batch based system that processes one
input file at a time.  So you download your checking account
and process it and close it, then your savings, and so on.

So download a CSV file from  your bank, drop it into
`open/input/` and run `ts-node process` and then follow the
to-do items.  Keep running `ts-node process` until it tells
you there are no to-do items, then you can run
`ts-node close` and start on the next file.

Once you've closed at least one batch, you can run 
`ts-node statements` and look in `closed/reports` to see
the statements.

When you first process a bank account or credit card, you'll need to jump
into the downloaded file and manually add a transaction for
the beginning balance. 

Hacker Finance does not really report "errors" exactly, it
provides a "to-do list".  The to-do items might be informative
enough to figure out the system without the tutorial - I really
don't know.

The system relies on "transform" routines, which are all
in `src/process-transforms.ts`.  When I posted all of this to Github
I provided transforms for JP Morgan Chase banking accounts, which
are checking and savings, and also for JP Morgan Chase credit
card accounts.  Also for my own use I made a transform for 
Capital One credit cards.  Transforms are trivially easy to code,
but if you need to do one, it will introduce about 10 minutes of
friction at the start of the learning process.  Please consider
opening a PR to contribute your transform.

A Hacker Finance user spends the most time mapping transactions to
expense and income accounts.  You can map multiple and recurring
transactions by description, or one-off transactions specifically.

When you map by description, you edit the file `masters/descriptionMap.csv`.
For repeating transactions with reliably recurring elements of their
description, edit one of the lines to remove all unique aspects and
then assign an offset account to it.  This is a master file, meaning
it is used forever and accumulates more and more useful mappings as
you use Hacker Finance.  Hacker Finance matches these
descriptions to descriptions this way:
* Sorts all your mappings by length - longest first
* Checks unmatched transactions by looking for a description 
  that is within the transaction description, using code something
  like `trx.description.includes(mappedDescription)`.

The system expects a 3-segment Chart of Accounts, which you
build up as you go (again, the to-do items will be very
explicit about what to do).  The first segment requires an exact spelling
of one of "Asset", "Liability", "Equity", "Income" or "Expense".
The second segment is anything you want.  The third segment is
also anything you want, is the highest level of detail,
and must be unique to the entire chart of accounts.  So you cannot
have "Income-Other-Interest" and "Expense-CreditCards-Interest" because
the key "Interest" can be used only one.  But you can use
"Interest/Inc" and "Interest/CC" or anything else like that.

You can create manual batches for things like depreciation or
to enter the year-end results for brokerage or retirment accounts,
which I do as it is not worth the trouble to import all of the transactions
for these accounts.  Use `ts-node open-manual` to kick off a manual
batch.