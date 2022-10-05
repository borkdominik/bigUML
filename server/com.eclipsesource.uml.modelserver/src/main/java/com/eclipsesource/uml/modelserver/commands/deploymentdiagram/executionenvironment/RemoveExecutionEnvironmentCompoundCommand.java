package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.executionenvironment;

public class RemoveExecutionEnvironmentCompoundCommand { /*-{

    public RemoveExecutionEnvironmentCompoundCommand(final EditingDomain domain, final URI modelUri,
                                                     final String semanticUriFragment, final String parentSemanticUri) {
        this.append(new RemoveExecutionEnvironmentCommand(domain, modelUri, semanticUriFragment, parentSemanticUri));
        this.append(new RemoveExecutionEnvironmentShapeCommand(domain, modelUri, semanticUriFragment));

        /*Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        ExecutionEnvironment executionEnvironmentToRemove = UmlSemanticCommandUtil.getElement(umlModel,
                semanticUriFragment, ExecutionEnvironment.class);*/

   // TODO: check if this is needed at later stage
   /*
    * Remove children
    * Collection<Setting> usagesNode = UsageCrossReferencer.find(nodeToRemove, umlModel.eResource());
    * for (Setting setting : usagesNode) {
    * EObject eObject = setting.getEObject();
    * if (isPropertyTypeUsage(setting, eObject, nodeToRemove)) {
    * String propertyUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment((Property) eObject);
    * this.append(new SetPropertyTypeCommand(domain, modelUri, propertyUriFragment, null));
    * }
    * }
    * }
    */

}
