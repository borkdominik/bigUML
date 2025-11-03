import { root, crossReference, CrossReference, ABSTRACT_ELEMENT, ROOT_ELEMENT } from "generator-langium-model-management";

/**
 * This file has been generated using the langium-model-management generator
 */
@root
class <%= EntryElementName %> {
  elements: Array<Element>;
}

class Element {
  name: string;
}
