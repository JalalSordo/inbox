## Test Compile
```javascript
node -e "console.log(require('./compile.js').compileContract('Lottery'))";
```
## Test Deploy
```javascript
node -e "console.log(require('./deploy.js').deploy('Lottery',[]))";
```