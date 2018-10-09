- There's a `ReflectionClass` used in the SDK (`zenaton-node/src/v1/Services/Properties.js:5`). I have no idea where that comes from and if it works. Such class just plain does not exists in neither vanilla Javascript nor NodeJS. Google says it exists in PHP. Hasty copy/paste?

- I couldn't find back where I've seen that, but you modify `Array` prototype somewhere : `Array.prototype.execute = () => {}`. In Javascript [that's a big nono](https://stackoverflow.com/questions/948358/adding-custom-functions-into-array-prototype).

- [You create new types of error instead of using the plain vanilla `Error` object](https://github.com/zenaton/zenaton-node/tree/master/src/Errors). Some people say [it's a bad practice](https://github.com/i0natan/nodebestpractices#-22-use-only-the-built-in-error-object). I think it's debatable: nowadays there are well known ways to create new error types and make sure to maintain the stack trace. But it's taking a risk for something critical that should most definitely never fail.

- You're using the same singleton mecanism everywhere, through class constructor, but it's unnecessary. ES6 Javascript modules are singleton by themselves (there are [edge cases](https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/) though). For example [this module](https://github.com/zenaton/zenaton-node/blob/master/src/v1/Workflows/WorkflowManager.js) is naturally a singleton (class instance is cached by NodeJS on export).

- You're checking for `undefined` a lot but not for `null`. In Javascript you should check for both.

- Code is very object oriented. Recently Javascript has taken a turn toward functionnal programming. That is in no way an obligation, but I would suggest trying to lean toward it if possible: it's a whole different state of mind but it leads to easier to maintain and less bug prone code.

- I'm not super fan of the standardjs-no-semicolon syntax, but I admit that's mostly a question of taste. No actually I think that can lead to super nasty bugs, but I won't fight for it. :-)

- Code seems very much _alpha_ at this point: lacks of comments, lacks of intermediary variables, some overcomplicated constructs made by twisting object oriented programming. Fortunatelly it's a small codebase but some parts are already difficult to understand for someone with no background on the subject.
