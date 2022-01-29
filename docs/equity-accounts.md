# Equity Accounts

It is beyond your humble author's capabilities to fully explain
Equity accounts, but at least I can tell you how to use them
in Hacker Finance for personal finance goals.

Equity accounts, as a purely practical matter, track two things:
* My net worth the day before I started using Hacker Finance
* My change in net worth each year I use Hacker Finance

Let's consider the first case.  The day before a person starts
using the system, he has 1000.00 in his Checking account, and owes
a friend 300.00.  So he has a debit balance of 1000.00 in an
asset account, and a credit balance of 300.00 in a Liability
account.

But there is a problem.  Debits must equal credits, where does
the other 700.00 get credited?  We can answer by asking, what
is that 700.00?  If he had 1000.00, and owed 300.00, then that
is his *net worth* as of that date.  So we need a place to store
what net worth was as of the first date we keep records.

That place is the "BeginBalances" account, a built-in equity
account.

In the tutorial, at the end of Lesson 9, the user had a begin
balance of 535.54, so the statements at the end of Lesson 9
show *Equity* (in this case, net worth at the start of record-keeping)
of 535.54:

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

The second use of Equity is to solve two practical problems
that occur over extended use of the system.  They both stem
from having transactions pile up over multiple years.
* Problem 1:  expenses and income keep piling up across
  years, so we cannot see year-to-date after the first year
* Problem 2:  we have no way to capture our change in net
  worth at the end of the year.  Our yearly change in net
  worth is crucial for having a sober and realistic view
  of our finances and our future.

These are both solved by the same thing, a "roll up"
(Which we do with `ts-node rollup.ts`), which tallies all
of the income and expense for the year, and creates a batch
that *reverses* them.  When that batch is imported and
processed, all income and expense will go to zero.

But if you have more income than expense (the hoped-for situation),
then this batch will not have an equal amount of debits and
credits.  Where does the difference go?  The difference
goes to the Equity account "Equity,Retained,Rollups".  Each
year this account will have a single transaction stating
the change in net worth for that year.  This can be very useful
for year-over-year use.


