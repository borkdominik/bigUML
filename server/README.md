# bigUML - bigGLSP Java Server

The bigGLSP Java Server implementation for bigUML.

> **Note:** It is not recommended anymore to implement features within the Java server. We are currently migrating the server to be a Node.js-based server. Therefore, you should try to implement the functionality as much as possible within the client structure by using the experimental server wrapper API.

- **Java 17 JDK**: Java 17 is required
- **Gradle**: We are using [Gradle](https://gradle.org/)
- **bigGLSP Framework**: The [bigGLSP - Java Server Framework](https://github.com/glsp-extensions/bigGLSP-framework) needs to be locally build + installed.

## Building (CLI)

Execute the command:

- `./gradlew clean build`

Running (+ building) the application:

- `./gradlew run`

Auto build:

- `./gradlew -t build`

Refresh Dependencies (reinstalls all dependencies again):

- `./gradlew --refresh-dependencies`

Windows: Use `./gradlew.bat`.

## VS Code

First install the recommended extensions. Afterward, you can use the Gradle extension to start the application directly from within VS Code.

### Using the Gradle Extension in VS Code

1. Open the Command Palette (`Ctrl+Shift+P`).
2. Type `Gradle` and select `View: Toggle Gradle`.
3. In the list of projects, right-click `com.borkdominik.big.glsp.uml` -> `Tasks` -> `application` -> `run`
4. (Click on `Pin Task`)
5. Execute `Run / Debug Task`

This will build and run the application using the Gradle tasks defined in the `build.gradle` file. You can monitor the output in the terminal window within VS Code.

## IDE

The development environment has been tested with Visual Studio Code (VSCode), and it is recommended for quick and lightweight development. However, since the project uses Gradle for building and managing dependencies, support for other IDEs such as IntelliJ IDEA and Eclipse should still be possible. You can import the project into these environments using their respective Gradle integration tools.

### VSCode

It is mandatory to open the server folder as root, otherwise, Gradle can not be detected by VSCode. Please read the documentation for [Gradle in VSCode](https://code.visualstudio.com/docs/java/java-build#_gradle) to learn how to build / debug / run with the IDE.

Recommended Extensions:

- [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)

The IDE will **rebuild** the changes for you - see status bar for progress. You only need to restart the application.
