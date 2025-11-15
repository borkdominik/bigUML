[
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "root"
    ],
    "properties": [
      {
        "name": "diagram",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "ClassDiagram"
          },
          {
            "type": "complex",
            "typeName": "StateMachineDiagram"
          },
          {
            "type": "complex",
            "typeName": "PackageDiagram"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "metaInfos",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "MetaInfo"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [],
    "name": "Diagram"
  },
  {
    "type": "class",
    "isAbstract": true,
    "decorators": [],
    "properties": [],
    "extends": [],
    "name": "ElementWithSizeAndPosition"
  },
  {
    "type": "class",
    "isAbstract": true,
    "decorators": [],
    "properties": [],
    "extends": [
      "ElementWithSizeAndPosition"
    ],
    "name": "Entity"
  },
  {
    "type": "class",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "name": "element",
        "isOptional": false,
        "decorators": [
          "crossReference"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "ElementWithSizeAndPosition"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "MetaInfo"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "name": "height",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "width",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "MetaInfo"
    ],
    "name": "Size"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "name": "x",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "y",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "MetaInfo"
    ],
    "name": "Position"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "diagramType",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"CLASS\\\"\""
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "entities",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "*"
      },
      {
        "name": "relations",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Relation"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [],
    "name": "ClassDiagram"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Enumeration"
          },
          {
            "type": "complex",
            "typeName": "EnumerationLiteral"
          },
          {
            "type": "complex",
            "typeName": "Class"
          },
          {
            "type": "complex",
            "typeName": "AbstractClass"
          },
          {
            "type": "complex",
            "typeName": "Interface"
          },
          {
            "type": "complex",
            "typeName": "Package"
          },
          {
            "type": "complex",
            "typeName": "Property"
          },
          {
            "type": "complex",
            "typeName": "Operation"
          },
          {
            "type": "complex",
            "typeName": "Parameter"
          },
          {
            "type": "complex",
            "typeName": "DataType"
          },
          {
            "type": "complex",
            "typeName": "PrimitiveType"
          },
          {
            "type": "complex",
            "typeName": "InstanceSpecification"
          },
          {
            "type": "complex",
            "typeName": "Slot"
          },
          {
            "type": "complex",
            "typeName": "LiteralSpecification"
          },
          {
            "type": "complex",
            "typeName": "Relation"
          },
          {
            "type": "complex",
            "typeName": "Abstraction"
          },
          {
            "type": "complex",
            "typeName": "Dependency"
          },
          {
            "type": "complex",
            "typeName": "Association"
          },
          {
            "type": "complex",
            "typeName": "Aggregation"
          },
          {
            "type": "complex",
            "typeName": "Composition"
          },
          {
            "type": "complex",
            "typeName": "InterfaceRealization"
          },
          {
            "type": "complex",
            "typeName": "Generalization"
          },
          {
            "type": "complex",
            "typeName": "PackageImport"
          },
          {
            "type": "complex",
            "typeName": "PackageMerge"
          },
          {
            "type": "complex",
            "typeName": "Realization"
          },
          {
            "type": "complex",
            "typeName": "Substitution"
          },
          {
            "type": "complex",
            "typeName": "Usage"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "ClassDiagramElements"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [
          "LengthBetween:3,10,{ message: \"Enumeration.name must be 3–10 characters\" }"
        ],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "values",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "EnumerationLiteral"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Enumeration"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "noBounds",
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "value",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "EnumerationLiteral"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [
          "Matches:/^[A-Z]/,{\n    message: \"First letter of class name must be uppercase.\",\n  }",
          "MinLength:5,{ message: \"Class name must be at least 5 characters long\" }"
        ],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isAbstract",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": false
      },
      {
        "name": "properties",
        "isOptional": true,
        "decorators": [
          "ValidateIf:(o) => o.isActive === true",
          "ArrayMaxSize:3,{\n    message: \"Active classes must declare at most 3 properties.\",\n  }",
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          }
        ],
        "multiplicity": "*"
      },
      {
        "name": "operations",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Operation"
          }
        ],
        "multiplicity": "*"
      },
      {
        "name": "isActive",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "skip",
        "isOptional": true,
        "decorators": [
          "skipPropertyPP"
        ],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Class"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      }
    ],
    "extends": [],
    "name": "Test"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "isAbstract",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": true
      },
      {
        "name": "label",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Class"
    ],
    "name": "AbstractClass"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [
          "LengthBetween:3,10,{ message: \"Interface.name must be 3–10 characters\" }"
        ],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "properties",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          }
        ],
        "multiplicity": "*"
      },
      {
        "name": "operations",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Operation"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Interface"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "noBounds"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isDerived",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": false
      },
      {
        "name": "isOrdered",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": false
      },
      {
        "name": "isStatic",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": false
      },
      {
        "name": "isDerivedUnion",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": false
      },
      {
        "name": "isReadOnly",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": false
      },
      {
        "name": "isUnique",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "defaultValue": false
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "PUBLIC"
      },
      {
        "name": "multiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "propertyType",
        "isOptional": true,
        "decorators": [
          "dynamicProperty:DataType",
          "crossReference"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "DataTypeReference"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "aggregation",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Property"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "noBounds",
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isAbstract",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isStatic",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isQuery",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "concurrency",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Concurrency"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "parameters",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Parameter"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [],
    "name": "Operation"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "noBounds",
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isException",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isStream",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isOrdered",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "isUnique",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "direction",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "ParameterDirection"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "effect",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "EffectType"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "parameterType",
        "isOptional": true,
        "decorators": [
          "dynamicProperty:DataType",
          "crossReference"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "DataTypeReference"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "multiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Parameter"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "DataType"
          },
          {
            "type": "complex",
            "typeName": "Enumeration"
          },
          {
            "type": "complex",
            "typeName": "Class"
          },
          {
            "type": "complex",
            "typeName": "Interface"
          },
          {
            "type": "complex",
            "typeName": "PrimitiveType"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "DataTypeReference"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [
          "MinLength:5"
        ],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "properties",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          }
        ],
        "multiplicity": "*"
      },
      {
        "name": "operations",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Operation"
          }
        ],
        "multiplicity": "*"
      },
      {
        "name": "isAbstract",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "DataType"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "PrimitiveType"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "slots",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Slot"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "InstanceSpecification"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "noBounds"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "definingFeature",
        "isOptional": true,
        "decorators": [
          "dynamicProperty:DefiningFeature",
          "crossReference"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "SlotDefiningFeature"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "values",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "LiteralSpecification"
          }
        ],
        "multiplicity": "*",
        "defaultValue": "[]"
      }
    ],
    "extends": [],
    "name": "Slot"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          },
          {
            "type": "complex",
            "typeName": "Class"
          },
          {
            "type": "complex",
            "typeName": "Interface"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "SlotDefiningFeature"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "value",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "LiteralSpecification"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "name": "source",
        "isOptional": false,
        "decorators": [
          "crossReference"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "target",
        "isOptional": false,
        "decorators": [
          "crossReference"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "relationType",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "RelationType"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Relation"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Abstraction"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Dependency"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "sourceMultiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "*"
      },
      {
        "name": "targetMultiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "*"
      },
      {
        "name": "sourceName",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "targetName",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "sourceAggregation",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "NONE"
      },
      {
        "name": "targetAggregation",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "NONE"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Association"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults",
      "astType:Association"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "sourceMultiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "*"
      },
      {
        "name": "targetMultiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "*"
      },
      {
        "name": "sourceName",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "targetName",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "sourceAggregation",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "SHARED"
      },
      {
        "name": "targetAggregation",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "NONE"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Aggregation"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults",
      "astType:Association"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "sourceMultiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "*"
      },
      {
        "name": "targetMultiplicity",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "*"
      },
      {
        "name": "sourceName",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "targetName",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "sourceAggregation",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "COMPOSITE"
      },
      {
        "name": "targetAggregation",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "defaultValue": "NONE"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Composition"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "InterfaceRealization"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "isSubstitutable",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Generalization"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "PackageImport"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [],
    "extends": [
      "Relation"
    ],
    "name": "PackageMerge"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Realization"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Substitution"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Usage"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "name": "diagramType",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"STATE_MACHINE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "StateMachineDiagram"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "diagramType",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE\\\"\""
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "entities",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "*"
      },
      {
        "name": "relations",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Relation"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [],
    "name": "PackageDiagram"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Class"
          },
          {
            "type": "complex",
            "typeName": "Package"
          },
          {
            "type": "complex",
            "typeName": "Abstraction"
          },
          {
            "type": "complex",
            "typeName": "Dependency"
          },
          {
            "type": "complex",
            "typeName": "PackageImport"
          },
          {
            "type": "complex",
            "typeName": "PackageMerge"
          },
          {
            "type": "complex",
            "typeName": "Usage"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "PackageDiagramElements"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "withDefaults"
    ],
    "properties": [
      {
        "name": "name",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "uri",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "visibility",
        "isOptional": true,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1"
      },
      {
        "name": "entities",
        "isOptional": true,
        "decorators": [
          "path"
        ],
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "*"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Package"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"NONE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"SHARED\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"COMPOSITE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "AggregationType"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"IN\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"OUT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"INOUT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"RETURN\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "ParameterDirection"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"CREATE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"READ\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"UPDATE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"DELETE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "EffectType"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"SEQUENTIAL\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"GUARDED\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"CONCURRENT\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Concurrency"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"ABSTRACTION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"AGGREGATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"ASSOCIATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"COMPOSITION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"DEPENDENCY\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"GENERALIZATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"INTERFACE_REALIZATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE_IMPORT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"ELEMENT_IMPORT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE_MERGE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"REALIZATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"SUBSTITUTION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"USAGE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "RelationType"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"PUBLIC\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PRIVATE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PROTECTED\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Visibility"
  }
]