# Model

The model is developed with the following **Eclipse IDE** version:

- **Name**: Eclipse Modeling Tools
- **Version**: 2023-12
- **Download**: <https://www.eclipse.org/downloads/packages/release/2023-12/r/eclipse-modeling-tools>
- 2024 version will not work.

## Gradle

To install the Gradle support via the Marketplace client, select Help Eclipse Marketplace…​. Search for Buildship, select the entry and install it.

## Import Projects

Afterward, you can import the projects:

- Via `File > Open Projects from File System`.
- Import the bigUML-server, e.g., `<path>/bigUML/server/model`

Then, you have to set the active target platform once to resolve all necessary plugins. To do so, open `targetplatform.target` (located in the module `bigUML/server/model/targetplatform`) and hit `Set as Active Target Platform` in the Target Editor. After the target platform is set, you can reload the target platform on demand.

## Eclipse Recommendations

- Switch the perspective to _Debug_ (`top right corner > Open Perspective > Debug`)
- You can see in this perspective under Debug (`left corner`) the currently running applications, and you can always restart them there or switch between the console outputs
- Create a key shortcut for `Build Clean` (`Window > Preferences > General > Keys > 'Build Clean'`), e.g., `Ctrl + Alt + C`, because **very often** the Eclipse IDE can not build the project and fails. Cleaning the project before starting it again helps - there is ongoing work to move away from the Eclipse IDE.
- Use the Package Explorer. There switch in the `View Menu (3 Dots / Menu icon) -> Package Presentation -> Hierarchical`
