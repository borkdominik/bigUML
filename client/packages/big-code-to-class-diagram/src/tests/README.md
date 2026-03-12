# Code-to-Class Diagram Tests

This directory contains unit tests for the Java code-to-UML class diagram conversion functionality.

## Test Structure

### Test File
- **`simple-unit-tests.test.ts`** - Main test file containing all unit tests for UML relationship detection

### Mock Files
All mock Java files are located in `../mock/java/` and follow a cohesive **Smart Home System** domain:

#### Core Classes
- **`Device.java`** - Abstract base class for all smart home devices
- **`Light.java`** - Concrete light class that extends Device and implements IControllable
- **`TemperatureSensor.java`** - Sensor class that extends Device and implements both IControllable and ISensor

#### Interfaces
- **`IControllable.java`** - Interface for controllable devices (turnOn, turnOff, isOn)
- **`ISensor.java`** - Interface for sensor devices (getValue, getUnit)

#### Relationship Classes
- **`Room.java`** - Contains collections of lights and sensors (aggregation relationships)
- **`SmartHomeController.java`** - Manages collections of devices and rooms (aggregation relationships)
- **`RemoteControl.java`** - Has a single device reference (aggregation relationship)
- **`House.java`** - Contains a single room reference (composition relationship)
- **`Building.java`** - Contains a collection of rooms (composition relationship)

## Test Cases

The test suite covers 7 specific UML relationship scenarios:

### 1. Inheritance (Generalization)
- **Test**: `should detect inheritance`
- **Files**: `Device.java`, `Light.java`, `TemperatureSensor.java`
- **Java**: `public class Light extends Device` and `public class TemperatureSensor extends Device`
- **UML**: Generalization edges from Light to Device and TemperatureSensor to Device

### 2. Single Interface Realization
- **Test**: `should detect realization`
- **Files**: `IControllable.java`, `Light.java`
- **Java**: `public class Light extends Device implements IControllable`
- **UML**: Realization edge from Light to IControllable

### 3. Multiple Interface Realization
- **Test**: `should detect multiple interface realization`
- **Files**: `IControllable.java`, `ISensor.java`, `TemperatureSensor.java`
- **Java**: `public class TemperatureSensor extends Device implements IControllable, ISensor`
- **UML**: Two Realization edges from TemperatureSensor to both interfaces

### 4. Non-Collection Aggregation
- **Test**: `should detect aggregation of non-collection`
- **Files**: `RemoteControl.java`, `Device.java`
- **Java**: `private Device device;`
- **UML**: Aggregation edge from RemoteControl to Device

### 5. Collection Aggregation
- **Test**: `should detect aggregation of collection`
- **Files**: `SmartHomeController.java`, `Device.java`, `Light.java`, `TemperatureSensor.java`, `Room.java`
- **Java**: `private List<Device> devices;` and `private List<Room> rooms;`
- **UML**: Multiple Aggregation edges from SmartHomeController to Device and Room, and from Room to Light and TemperatureSensor

### 6. Non-Collection Composition
- **Test**: `should detect composition`
- **Files**: `House.java`, `Room.java`
- **Java**: `private final Room room;`
- **UML**: Composition edge from House to Room

### 7. Collection Composition
- **Test**: `should detect composition of collection`
- **Files**: `Building.java`, `Room.java`
- **Java**: `private final List<Room> rooms;`
- **UML**: Composition edge from Building to Room

## Test Architecture

### Helper Functions
- **`generateDiagram(javaFiles: string[])`**: Parses Java files and generates UML diagram
- **`findEdge(diagram, fromClass, toClass, edgeType?)`**: Finds specific edges in the diagram

### Test Pattern
Each test follows this pattern:
1. Generate diagram from specific Java files
2. Look for expected UML relationships
3. Assert that relationships exist with correct types

### Mock File Organization
- **Single responsibility**: Each mock file demonstrates one specific relationship type
- **Cohesive domain**: All files belong to the Smart Home System domain
- **Minimal complexity**: Files contain only the necessary code to demonstrate relationships

## Running Tests

### Prerequisites
- Node.js and npm installed
- Dependencies installed: `npm install`

### Commands
```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

## Test Coverage

### Successfully Tested Features

1. **Inheritance Detection**: Both single and multiple inheritance scenarios
2. **Interface Realization**: Single and multiple interface implementations
3. **Aggregation Relationships**: Both collection and non-collection types
4. **Composition Relationships**: Both collection and non-collection types
5. **Property Detection**: Access modifiers, types, and multiplicity
6. **Method Detection**: Method signatures, parameters, and return types
7. **Package Resolution**: Correct package name extraction and node ID generation

### Test Results
All tests are currently **passing**, indicating that the Java parser correctly:
- Detects class inheritance (`extends`)
- Detects interface implementation (`implements`)
- Distinguishes between aggregation and composition based on access modifiers and parameter passing
- Handles both collection and non-collection relationships
- Properly extracts type information from generic collections
- Generates correct UML edge types and multiplicities

## Adding New Tests

To add new test cases:

1. **Create mock Java files** in `../mock/java/` that demonstrate the relationship
2. **Add test method** in `simple-unit-tests.test.ts`
3. **Follow naming convention**: `should detect [relationship type]`
4. **Include relevant files** in `generateDiagram()` call
5. **Use `findEdge()`** to locate expected relationships
6. **Set appropriate expectations** based on parser capabilities

## Troubleshooting

### Common Issues
- **Missing mock files**: Ensure all referenced Java files exist in `../mock/java/`
- **Parser initialization**: Tests require tree-sitter Java parser to be initialized
- **Edge type mismatches**: Verify expected edge types match parser output
- **Collection vs non-collection**: Both collection and non-collection properties now create edges

### Debugging
- Check console output for detailed parsing information
- Verify mock Java files have correct syntax
- Ensure all required classes are included in `generateDiagram()` calls

## Implementation Notes

The current implementation successfully handles:
- **Complex type resolution**: Extracts generic type arguments from collections
- **Relationship classification**: Uses access modifiers and parameter analysis to distinguish aggregation vs composition
- **Multiplicity detection**: Correctly identifies collection vs non-collection relationships
- **Package-aware node IDs**: Generates unique IDs using package names
- **Comprehensive property parsing**: Extracts all field information including access modifiers and types 