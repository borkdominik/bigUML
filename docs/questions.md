# Common Questions

## Server

> After restarting GLSP, I got an exception

```java
Exception in thread "main" java.lang.Error: Unresolved compilation problems:
    ElkLayoutEngine cannot be resolved
    LayeredMetaDataProvider cannot be resolved to a type
    DefaultCLIParser cannot be resolved to a type
    LaunchUtil cannot be resolved
    LaunchUtil cannot be resolved
    DefaultCLIParser cannot be resolved to a variable
    The method configureDiagramModule(UmlDiagramModule) is undefined for the type UmlServerModule
    SocketGLSPServerLauncher cannot be resolved to a type
    ParseException cannot be resolved to a type
    LaunchUtil cannot be resolved
    DefaultCLIParser cannot be resolved

    at com.eclipsesource.uml.glsp.UmlGLSPServerLauncher.main(UmlGLSPServerLauncher.java:31)
```

If you get this or a similar exception after you restart a server, then that means (most of the time) that Eclipse failed to build correctly. Triggering a `Clean` (`Project > Clean`) should fix the exception. It is recommended to bind the `Clean` task to a shortcut.

> Eclipse shows that my code is invalid, but that is not the case?

Execute the `Clean` task (see question before)

## Client

> VSCode can not find the dependencies anymore after building/watching - VSCode says that the dependency does not exist but it does

This problem sometimes occurs after you rebuild your project in the background (e.g., `yarn prepare`, `yarn watch`). In some cases, the `TypeScript Server` fails to detect your changes. The solution is to restart the `TypeScript Server`. You can fix that by opening a TypeScript file and triggering `default: Ctrl + Shift + p` and selecting `>TypeScript: Restart TS server`.

> After running `yarn watch` or `yarn watch:theia` I got a `Error: ENOSPC: System limit for number of file watchers reached`

You have reached your OS `inotify` limit. Please check the resources:

- <https://github.com/eclipse-theia/theia/discussions/7942>
- <https://github.com/eclipse-theia/theia/blob/bda9ff9d4cf15b28b5ffc2e984f11834adfc8f33/doc/Developing.md#linux>
