# Diceware

First, feel free to chekc out the live demo, running at [https://www.dmuth.org/diceware/](https://www.dmuth.org/diceware/)

Weak passwords are a big flaw in computer security due to a lack of "entropy" or randomness. For example, how many times have you used the name of a pet or relative or street in a password, or perhaps the number "1". Not very random, is it? :-) Worse still, if passwords are reused between services, that increases your security risk.

Fact is, humans are terrible at remembering random combiations of letters and numbers, but we are great at remembering phrases of words. That's where Diceware comes in.

Diceware is based on the proposal at [http://world.std.com/~reinhold/diceware.html](http://world.std.com/~reinhold/diceware.html) wherein virtual dice are roled 5 times, and the 5 digit number used against a lookup table of words. 4 dice rolls gives you 4 random words which are easy for a human being to remember, yet have a high amount of entropy which makes them hard to crack.

For more information on Diceware:
- [The Diceware Passphrase FAQ](http://world.std.com/~reinhold/diceware.html)
- [Diceware word list](http://world.std.com/~reinhold/diceware.wordlist.asc)
- [Diceware for Passphrase Generation and Other Cryptographic Applications](http://world.std.com/~reinhold/diceware.txt)


# Can I run this on my own computer without using your website?

Yes.  Feel free to clone this repo with `git clone https://github.com/dmuth/diceware.git` and run it
from a local directory on your computer.


# Will this work on an iPhone?

Yep!  It should work on any mobile phone or tablet that supports Javascript, but I have only
tested it on an iPhone 5S at this time.


# Who built this? / Contact

My name is Douglas Muth, and I am a full-time software engineer in Philadelphia, PA.

There are several ways to get in touch with me:
- Email to doug.muth AT gmail DOT com or dmuth AT dmuth DOT org
- [Facebook](https://facebook.com/dmuth) and [Twitter](http://twitter.com/dmuth)
- [LinkedIn](http://localhost:8080/www.linkedin.com/in/dmuth)

Feel free to reach out to me if you have any comments, suggestions, or bug reports.

