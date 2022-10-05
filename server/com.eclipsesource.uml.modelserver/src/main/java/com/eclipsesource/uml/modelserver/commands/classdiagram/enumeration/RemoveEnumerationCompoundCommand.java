package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

public class RemoveEnumerationCompoundCommand { /*-{

   public RemoveEnumerationCompoundCommand(final EditingDomain domain, final URI modelUri,
                                           final String semanticUriFragment) {
      this.append(new RemoveEnumerationCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveEnumerationShapeCommand(domain, modelUri, semanticUriFragment));

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      Enumeration enumerationToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
            Enumeration.class);

      Collection<Setting> usagesEnumeration = UsageCrossReferencer.find(enumerationToRemove, umlModel.eResource());
      for (Setting setting : usagesEnumeration) {
         EObject eObject = setting.getEObject();
         if (isPropertyTypeUsage(setting, eObject, enumerationToRemove)) {
            String propertyUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment((Property) eObject);
            this.append(new SetPropertyTypeCommand(domain, modelUri, propertyUriFragment, null));
         }
      }
   }

   protected boolean isPropertyTypeUsage(final Setting setting, final EObject eObject,
                                         final Enumeration enumerationToRemove) {
      return eObject instanceof Property
            && eObject.eContainer() instanceof Class
            && setting.getEStructuralFeature().equals(UMLPackage.Literals.TYPED_ELEMENT__TYPE)
            && enumerationToRemove.equals(((Property) eObject).getType());
   }
   */
}
