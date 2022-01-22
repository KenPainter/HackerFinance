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
* Complete detailed transaction listing
* Currency format on statement is user-specified (en-US default)
* One master file: the chart of accounts
* A batch system for importing your transactions
  * Remembers recurring transactions by descriptions (that you define)
  * Allows direct mapping of one-time transactions
  * Special manual batches for increased flexibility

Features I will probably get around to:
* Date-filtered statements
* Year-end rollup 
* (maybe someday) nice HTML reports

## Learn By Following the Tutorial

Everything is in [The tutorial](docs/tutorial.md).

## Learn Without the Tutorial

I think it might be possible to learn Hacker Finance just
by running `ts-node process` and checking off the
"to-do" items that it presents to you.  

But to be sure, I wrote [The User Guide](docs/user-guide.md).

## Contributing

Contributions are welcome.  Hacker Finance is incredibly simple,
there are no style guides or anything at all like that.  Just
please don't break anything that already works.