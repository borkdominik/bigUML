type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
  [key: string]: JSONValue;
}
type JSONArray = JSONValue[];
type JSONPathNode = {
  value: JSONValue;
  path: string;
};

export function findNodes(json: JSONValue, expression: string, value?: any): Array<JSONPathNode> {
  const allElements: any = [];
  collect(json, "$", allElements);
  return allElements.filter((element: any) => {
    if (typeof element.value === "object" && Object.keys(element.value).includes(expression)) {
      return value ? element.value[expression] === value : true;
    }
    return false;
  });
}

export function collect(json: JSONValue, currentPath: string, pathNodes: Array<JSONPathNode>) {
  if (json !== undefined && json !== null && typeof json === "object") {
    if (Array.isArray(json)) {
      json.forEach((subJson, index) => {
        collect(subJson, currentPath + "[" + index + "]", pathNodes);
      });
    } else {
      Object.keys(json).forEach((key) => {
        collect(json[key], currentPath + "." + key, pathNodes);
      });
    }
  }
  pathNodes.push({ path: currentPath, value: json });
}
