# Hacker Finance

## The Premise

Modern personal finance sites and apps do three things for you:
* Connect to your financial institutions and import your transactions
* Automatically map those transactions into buckets like "Gas", "Lodging"
  and "Entertainment".  
* Show colorful charts detailing your expenses

When I tried to use a few of these cheap/free apps I always ended up
spending most of my time in a clumsy UI trying to fix the mappings into
categories that are more useful to me.

So I decided if I were going to spend the time on the mapping,
I'd rather do it in a code editor.  I don't need the colorful
charts (though perhaps they would be fun to do later) and 
am comfortable coding up financial statements, so I decided
to create for myself Hacker Finance.

Hacker Finance is hacker-friendly, a small set of tools are meant
to support the user's imagination in creating a complete financial
picture to any arbitrary level of complexity and detail.

## It Might Be For You If...

Hacker Finance attempts to provide an optimized solution to the
problem of personal finance for hackers:
* The user is not satisfied with the ability of free/cheap
  personal finance apps to categorize their transactions
* The user wishes to have a complete picture of their finances
  including, if desired, taxes, vehicles, depreciation, real estate
  and so on
* The user is a hacker:
    * will dream up their own way to use a flexible set of tools
    * expects full control of their data
    * is fine with downloading some files from their bank
    * is comfortable with a CLI
    * is comfortable (and probably prefers) working in a code editor
    * will learn a few bookkeeping ideas for the fun of it and
      because it helps get the job done

## Installing

Step 1: Install ts-node

Step 2: Clone the Repo

Step 3: Run `npm install`

Step 4: run `ts-node setup.ts`

Step 5: If you are not in the USA, edit `data/0-masters/locale.txt` and set
it to your locale.

## Features

Hacker Finance has exactly the features I wanted for myself,
and as of this writing I'm the only contributor so here they are:

Outputs:
* Balance Sheet at 3 different levels of detail
* Income Statement at 3 different levels of detail
* Trial Balance at 3 different levels of detail
* All outputs at working batch level and at global level
* Detailed transaction listings for reconciling

Inputs:
* A flexible "transform" system to make it easier for
  the next user to extend Hacker Finance for the format their
  bank provides.  Transforms available at this writing:
  * JP Morgan Chase CSV files for checking and savings
  * JP Morgan Chase CSV files for credit cards
  * Capital One CSV files for credit cards
  * Manually created CSV input files

Workflow:
* A basic build-as-you-go approach.  Real statements do
  require a chart of accounts, but you add accounts only
  as you work through transactions.
* A few basic checks to make sure we don't shoot ourselves
  in the foot by double-importing a file or anything like that.
* High visibility of the status of your working set.  As I
  use it myself I imported over 3000 transactions (all of 2021 from
  multiple sources) and had no trouble keeping everything straight.
* Automated mapping of repeating and recurring transactions, 
  with a permanent memory of the rules.  Which of course you can
  go change any time you want for any reason.
* Some basic UNDO if you munge your working set and want to
  start over.
* Completely subvertible.  Everything is on files on disk - go
  munge up anything you want for your own reasons.

Features I will definitely get around to
* Year-end rollup
* Date-filtered statements (probably automatically by year)
* (maybe someday) nice HTML reports

## Learn By Following the Tutorial

It's all in the [tutorial](/docs/tutorial.md)

## Contributing

Contributions are welcome.  Hacker Finance is incredibly simple,
there are no style guides or rules, except to please not break
anything.