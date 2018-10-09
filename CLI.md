- You should use `path.resolve()` for this [kind of things](https://github.com/zenaton/agent/blob/master/cli/src/worker.js#L164).

- [That's too convoluted](https://github.com/zenaton/agent/blob/master/cli/src/worker.js#L147). Why not just throw an error?

- [Is there no files rights problem risk?](https://github.com/zenaton/agent/blob/master/cli/src/worker.js#L47)

- About [this](https://github.com/zenaton/agent/blob/master/cli/src/infoCommand.js#L14), you should either use real `Error` object that will give you the stack trace, or if you just want to return something arbitrary, return and don't throw.

- [Don't change parameters value.](https://github.com/zenaton/agent/blob/master/cli/src/infoCommand.js#L20)
