package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.component;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.UMLFactory;

public class AddComponentCommand extends UmlSemanticElementCommand {

   protected final Component newComponent;
   protected final String parentSemanticUriFragment;

   public AddComponentCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.newComponent = UMLFactory.eINSTANCE.createComponent();
      this.parentSemanticUriFragment = null;
   }

   public AddComponentCommand(final EditingDomain domain, final URI modelUri, final String parentUri) {
      super(domain, modelUri);
      this.newComponent = UMLFactory.eINSTANCE.createComponent();
      this.parentSemanticUriFragment = parentUri;
   }

   @Override
   protected void doExecute() {
      newComponent.setName(UmlSemanticCommandUtil.getNewPackageableElementName(umlModel, Component.class));

      if (parentSemanticUriFragment == null) {
         umlModel.getPackagedElements().add(newComponent);
      } else {
         EObject parentObject = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment);
         // TODO: add other elements later!
         if (parentObject instanceof Device) {
            Device parentDevice = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Device.class);
            parentDevice.getNestedClassifiers().add(newComponent);
         }
      }
   }

   public Component getNewComponent() {
      return newComponent;
   }
}
