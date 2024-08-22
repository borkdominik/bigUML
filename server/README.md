# Server

## Requirements

The Server is developed with the following **Eclipse IDE** version:

- **Name**: Eclipse Modeling Tools
- **Version**: 2023-12
- **Download**: <https://www.eclipse.org/downloads/packages/release/2023-12/r/eclipse-modeling-tools>
- 2024 version will not work.

You also need the following installations:

- **Java 17 JDK**

Finally, we need to clone <https://github.com/glsp-extensions/bigGLSP-framework>.

## Install Eclipse

Download and install/extract the Eclipse IDE.

### Install Maven

You first need to install the following plugin:

- The M2Eclipse (Maven Integration for Eclipse) plugin:
  - Install it via `Help > Install New Software`
  - Maven Integration for Eclipse Update Site - <http://download.eclipse.org/technology/m2e/releases/latest>
  - Install _Maven Integration for Eclipse_

### Import Projects

Afterward, you can import the projects:

- Via `File > Open Projects from File System`.
- First import the bigUML-server, e.g., `<path>/bigUML/server`:
- Then import the bigGLSP framework, e.g., `<path>/bigGLSP-framework`

Then, you have to set the active target platform once to resolve all necessary plugins. To do so, open `targetplatform.target` (located in the module `bigUML/server/targetplatform`) and hit `Set as Active Target Platform` in the Target Editor. After the target platform is set, you can reload the target platform on demand.

Sometimes the Eclipse IDE does not compile correctly - restarting and setting the targetplatform again helps.

## Eclipse Recommendations

- Switch the perspective to _Debug_ (`top right corner > Open Perspective > Debug`)
- You can see in this perspective under Debug (`left corner`) the currently running applications, and you can always restart them there or switch between the console outputs
- Create a key shortcut for `Build Clean` (`Window > Preferences > General > Keys > 'Build Clean'`), e.g., `Ctrl + Alt + C`, because **very often** the Eclipse IDE can not build the project and fails. Cleaning the project before starting it again helps - there is ongoing work to move away from the Eclipse IDE.

## Execution

To start the server, run or debug the following launch config (`Right Click > Run As`):

- `com.borkdominik.big.glsp.uml/UmlGLSPServer.launch` located in module `com.borkdominik.big.glsp.uml`
