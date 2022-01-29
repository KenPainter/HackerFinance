# Exchange Accounts

Exchange accounts are used to prevent duplication of
transactions, and they also help us to ensure we have
processed all of our sources.

Hacker Finance has two built-in exchange accounts:
* Equity-Exchange-Payments
* Equity-Exchange-Transfers

We use "Payments" for payments to liabilities, like
loans or credit cards, and "Transfers" for transfers
between asset accounts like checking and savings.

> Technically you could use just one if you wanted,
> but if you use both it is easier to track down a
> mistake.

Consider the case of a payment from Checking to a credit
card.  It might be tempting to map the payment to the
credit card directly, so that in effect you would have:

```
date: 2020-07-23
Debit Account: Checking
Amount: -100.00
Credit Account: EasyCreditCC
```

But right off the bat this is a problem, we are recording
the payment as *impacting the balance of the credit card*
on the date we requested the payment, which may not be true.
We do not really know yet when the credit card company will
*post* the transaction to their ledger.

Second, as stated above we are *impacting the balance of the credit card*,
but the authoritative source on the credit card balance is the
credit card company, not us.  If we continue to insist on mapping
the the payment out of checking directly to the credit card, then
presumably we would do the same thing when we process the credit
card download, mapping payments there back to Checking.  This
duplicates the transaction and wrecks the balance on both accounts.


```
date: 2020-07-26
Debit Account: EasyCreditCC
Amount: 100.00
Credit Account: Checking
```

We solve both problems by using an Exchange account.  When we
go to online banking and make a payment to a credit card, all
we know is that the money left the checking account, the
checking balance is reduced, but that is all we know.  The money
is out in limbo somewhere.  That limbo is an "exchange" account.

When we later process the credit card transactions, we will also
record payments made as mapping to "Payments", and in that way
the transaction "claims" some of the pile of money in the 
"Payments" account.

It should be clear that if our bank and credit card company are
both accurate, The Payments account will be zero.  Since financial
institutions have extremely high accuracy, if we have a non-zero
amount in the Payments account, it almost always means:
* We have processed one account, like checking, but not the
  other accounts
* We have made a mistake that must be tracked down and corrected

