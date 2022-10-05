package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

public class RemoveInterfaceCompoundCommand { /*-{

   public RemoveInterfaceCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      this.append(new RemoveInterfaceCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveInterfaceShapeCommand(domain, modelUri, semanticUriFragment));

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      Interface interfaceToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Interface.class);

      Collection<Setting> usagesInterface = EcoreUtil.UsageCrossReferencer.find(interfaceToRemove, umlModel.eResource());
      for (Setting setting : usagesInterface) {
         EObject object = setting.getEObject();
         if (isAssociationTypeUsage(setting, object)) {
            String associationUriFragment = UmlNotationCommandUtil.getSemanticProxyUri((Association) object.eContainer());
            this.append(new RemoveAssociationCompoundCommand(domain, modelUri, semanticUriFragment));
         }
      }
   }


   protected boolean isAssociationTypeUsage(final Setting setting, final EObject eObject) {
      return eObject instanceof Property
            && eObject.eContainer() instanceof Association
            && ((Property) eObject).getAssociation() != null;
   }
   */
}
