# Hacking The System

There are a few simple ideas that guide Hacker Finance hacking.

All scripts are idempotent. The only exception is the make-budget
script, which will refuse to take action if a budget already exists.

All scripts are brute-force start-to-finish.  

The filesystem is the database.

CSV files are easiest to load, save, and edit.  Best optimization
of coding and using.

## Dates

Dates are stored as 8 digit strings of YYYYMMDD.  This lets us
sort them and filter on them easily.  All formatting for human
eyes is done at reporting time.

The only magic number is for rollups.  The date of a rollup is
YYYY1299, with fictional day 12/99 being the magic number.  This
is a constant that is present in code in more than one place.

## Currency Figures

These are stored as strings, since the only arithmetic we do is
addition.  If we import them as numbers, they will be floats,
and as we add them up we'll get floating point errors.

When summing them, we multiply them by 100 and treat them as
integers.