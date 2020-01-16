# Diceware

Current build/test status in Travis CI: [![Build Status](https://travis-ci.org/dmuth/diceware.svg?branch=master)](https://travis-ci.org/dmuth/diceware)

First, feel free to check out the live demo, running at [https://www.dmuth.org/diceware/](https://www.dmuth.org/diceware/)

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

You can also set up a webserver on Mac/Linux boxes by running `python -m SimpleHTTPServer 8000`. 
You will then able to access DiceWare at http://localhost:8000/.


# Will this work on an iPhone?

Yep!  It should work on any mobile phone or tablet that supports Javascript, but I have only
tested it on an iPhone 5S at this time.


# Will this work in an air-gapped environment?

Yes, copies of assets such as Bootstrap and jQuery have been made, and Diceware can now be run without
requiring an Internet connection.


# Development

This app is built with <a href="https://webpack.js.org/">Webpack</a>.

When done editing `main.js`, the packed file can be built by simply running `webpack` 
on the command line.  It will be writing to `dist/bundle.js`.  To run webpack in a 
mode so that it regularly checks for changed files, run `webpack --watch --mode development`.

In a move that departs from Best Practices, I have made the decision to include 
the packed file in Git.  My reason for this is that the software will be ready 
to run as soon as it is checked out (or a ZIP is downloaded), and that is a key 
design feature of this app--I want it to be as easy to get up and running as possible.

A local webserver can be set up by running `npm install http-server -g` to install it, then `http-server` to listen on http://localhost:8080/

In summary:

- `npm install` - Install NPM packages used by Diceware
- `webpack --watch --mode development` - Pack Javscript files
- `http-server`
- `npm test` - Make sure you didn't break any of the core logic!
- `webpack` - Pack Javscript files in production mode (smaller file but takes longer)
- `./go-sync-to-s3.sh` - Do this if you're me, to upload to S3.  If you're not me, you'll need to do something else, or possibly nothing at all.


# Who built this? / Contact

My name is Douglas Muth, and I am a software engineer in Philadelphia, PA.

There are several ways to get in touch with me:
- Email to doug.muth AT gmail DOT com or dmuth AT dmuth DOT org
- [Facebook](https://facebook.com/dmuth) and [Twitter](http://twitter.com/dmuth)
- [LinkedIn](http://localhost:8080/www.linkedin.com/in/dmuth)

Feel free to reach out to me if you have any comments, suggestions, or bug reports.

