# Credit Cards

## Download Batches and Dates

It is easiest to process credit cards based on their statement periods.

This is because most institutions do not list daily balances, they only
display balances at the start and end of statement periods.  Since our
most important bookkeeping task is to ensure our balances are correct,
we just follow the statement periods.

## Dates

Credit card companies put two dates on transactions: the transaciton date
and the posting date.  The posting date tells us which statement it will
appear on.  So we go by the posting date.

## Transforms 

If you write a transform for a credit card, you usually have to swap the
signs on the amounts so that:
* Payments received are positive numbers
* Charges made are negative numbers

Also, always use the posting date (if there are two dates available) as
that is the date that lets us reconcile to statements.
