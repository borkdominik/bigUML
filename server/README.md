# UML Editor - Server Development

## Getting started with the Eclipse IDE

- Please make sure your Eclipse workspace uses a JRE of Java 11.
- We use the [Eclipse Modeling Tools](https://www.eclipse.org/downloads/packages/release/2020-12/r/eclipse-modeling-tools)
- The following Eclipse plugins are required:
  - The M2Eclipse (Maven Integration for Eclipse) plugin:
     - Update site location: http://download.eclipse.org/technology/m2e/releases/
     - Install *Maven Integration for Eclipse*
- Import all maven projects via `File > Import... > Maven > Existing Maven Projects > Root directory: $REPO_LOCATION`.
  - You may skip the parent modules (i.e. `com.eclipsesource.uml.parent`, `com.eclipsesource.uml.glsp.app` and `com.eclipsesource.uml.modelserver.app`)
  - You need to set the active target platform once to be able to resolve all necessary plugins. To do so, open `r2020-09.target` (located in the module `targetplatform`) and hit `Set Active Target Platform` in the Target Editor. After the target platform is set, you can simple reload the target platform on demand.


## Build

To build the model server as standalone JAR and execute all component tests execute the following maven goal in the root directory:
```bash
mvn clean install
```

## Running/Debugging

### Execute from IDE
To start both server instances within the Eclipse IDE, run or debug the Launch Group configuration `UML-GLSP App.launch` (located in module `com.eclipsesource.uml.modelserver.product`).

To start the instances separately, run or debug the following launch configs as Eclipse products:
- `com.eclipsesource.uml.modelserver.product.launch` located in module `com.eclipsesource.uml.modelserver.product`
- `com.eclipsesource.uml.glsp.product.launch` located in module `com.eclipsesource.uml.glsp.product`


