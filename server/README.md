# bigUML - bigGLSP Java Server

The bigGLSP Java Server implementation for bigUML.

- **Java 17 JDK**: Java 17 is required
- **Gradle**: We are using [Gradle](https://gradle.org/)
- **bigGLSP Framework**: The [bigGLSP - Java Server Framework](https://github.com/glsp-extensions/bigGLSP-framework) needs to be locally build.

## Building (CLI)

Execute the command:

- Linux: `./gradlew clean build`
- Windows: `./gradlew.bat clean build`

Running the application:

- Linux: `./gradlew run`
- Windows: `./gradlew.bat run`

## IDE

The development environment has been tested with Visual Studio Code (VSCode), and it is recommended for quick and lightweight development. However, since the project uses Gradle for building and managing dependencies, support for other IDEs such as IntelliJ IDEA and Eclipse should still be possible. You can import the project into these environments using their respective Gradle integration tools.

### VSCode

It is mandatory to open the server folder as root, otherwise, Gradle can not be detected by VSCode. Please read the documentation for [Gradle in VSCode](https://code.visualstudio.com/docs/java/java-build#_gradle) to learn how to build / debug / run with the IDE.

Recommended Extensions:

- [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)

The IDE will rebuild the changes for you - see status bar for progress.
