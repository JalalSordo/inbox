## Test Compile
node -e "console.log(require('./compile.js').compileContract('Lottery'))";
## Test Deploy
node -e "console.log(require('./deploy.js').deploy('Lottery',[]))";