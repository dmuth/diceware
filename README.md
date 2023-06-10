# Diceware

<img src="./assets/img/dice.jpg" width="250" align="right" />

Feel free to check out the live version at [https://diceware.dmuth.org/](https://diceware.dmuth.org/)

Weak passwords are a big flaw in computer security due to a lack of "entropy" or randomness. For example, how many times have you used the name of a pet or relative or street in a password, or perhaps the number "1". Not very random, is it? :-) Worse still, if passwords are reused between services, that increases your security risk.

Fact is, humans are terrible at remembering random combiations of letters and numbers, but we are great at remembering phrases of words. That's where Diceware comes in.

Diceware is based on the proposal at [http://world.std.com/~reinhold/diceware.html](http://world.std.com/~reinhold/diceware.html) wherein virtual dice are roled 5 times, and the 5 digit number used against a lookup table of words. 4 dice rolls gives you 4 random words which are easy for a human being to remember, yet have a high amount of entropy which makes them hard to crack.

For more information on Diceware:
- [The Diceware Passphrase FAQ](http://world.std.com/~reinhold/diceware.html)
- [Diceware word list](http://world.std.com/~reinhold/diceware.wordlist.asc)
- [Diceware for Passphrase Generation and Other Cryptographic Applications](http://world.std.com/~reinhold/diceware.txt)


# Can I run this on my own computer without using your website?

Yes!  Go to https://github.com/dmuth/diceware/releases and download the latest `diceware.zip` file.
When you unzip that file, the contents will be written to a directory called `diceware/`.  You 
can then point a webserver on your machine to `diceware/index.html` in order to use Diceware.

Sadly, you cannot open `diceware/index.html` directly, as the CORS policy in Chrome prevents that.
If you know of a way to fix that, please [open an issue](https://github.com/dmuth/diceware/issues). :-)


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

## In summary:

- Development
    - `npm run clean` - Cleanup after a previous run
    - `npm install` - Install NPM packages used by Diceware
    - `npm run dev-build` - Run webpack to pack Javascript files and watch for changes.
    - `http-server`
    - `vim src/lib.js src/index.js`
        - Be sure to check in your changes before the next step!
- Testing
    - `rm -fv src/index.js && git co src/index.js` - Get the new SHA1 hash that will be displayed in debug messages.
        - The hash can be crosschecked with the results of `git hash-object src/index.js`
    - `npm test` - Make sure you didn't break any of the core logic!
    - `npx cypress run` - Run front-end testing
        - If the tests break, run `npx cypress open` to run tests interactively.
- Deployment
    - `npm run build` - Webpack Javscript files in production mode (smaller file but takes longer)
    - `./go-sync-to-s3.sh` - Do this if you're me, to upload to S3.  If you're not me, you'll need to do something else, or possibly nothing at all.


## In practice:

- `npm run clean; npm run dev-build` - Run webpack in dev mode while working on Javascript
   - `http-server` - Stand up a local HTTP server
   - `vim src/lib.js src/index.js`
   - `rm -fv src/index.js && git co src/index.js`
- `npm run clean; npm run build` - Run webpack in prod mode to produce final Javascript bundle
- `./go-sync-to-s3.sh` - Do this if you're me, to upload to S3.  If you're not me, you'll need to do something else, or possibly nothing at all.


### Releasing a New Build

- `npm run release-build` to create the ZIP file `diceware.zip` with all assets in it, including `bundle.js` and the contents of `node_modules/`.
- `gh release create v1.0.1` to upload a release to https://github.com/dmuth/diceware/releases.  
    - Change the tag for the version number accordingly.
- `gh release upload v1.0.1 diceware.zip` to upload the ZIP file containing everything


## Development In Docker

Wanna develop in Docker?  We got you covered.  Here are some helper scripts:

- `bin/docker-build.sh` - Build the Docker copntainer
- `bin/docker-dev.sh` - Run in dev mode--listening on http://localhost:8000/
- `bin/docker-prod.sh` - Run in prod mode--listening on http://localhost:80/
- `bin/docker-push.sh` - Push to Docker Hub


# Who built this? / Contact

My name is Douglas Muth, and I am a software engineer in Philadelphia, PA.

There are several ways to get in touch with me:
- Email to doug.muth AT gmail DOT com or dmuth AT dmuth DOT org
- [Facebook](https://facebook.com/dmuth) and [Twitter](http://twitter.com/dmuth)
- [LinkedIn](https://linkedin.com/in/dmuth)

Feel free to reach out to me if you have any comments, suggestions, or bug reports.

