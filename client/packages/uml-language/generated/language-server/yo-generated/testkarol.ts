[
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "root"
    ],
    "properties": [
      {
        "name": "elements",
        "isOptional": false,
        "decorators": [],
        "types": [
          {
            "type": "complex",
            "typeName": "Element"
          }
        ],
        "multiplicity": "+"
      }
    ],
    "extends": [],
    "name": "Model"
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
    "extends": [],
    "name": "Element"
  }
]