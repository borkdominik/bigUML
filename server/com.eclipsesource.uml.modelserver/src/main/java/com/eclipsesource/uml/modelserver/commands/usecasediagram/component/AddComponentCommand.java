package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

public class AddComponentCommand extends UmlSemanticElementCommand {

   protected final Component newComponent;
   protected final String parentSemanticUri;

   public AddComponentCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUri) {
      super(domain, modelUri);
      this.newComponent = UMLFactory.eINSTANCE.createComponent();
      this.parentSemanticUri = parentSemanticUri;
   }

   @Override
   protected void doExecute() {
      Package parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUri, Package.class);
      newComponent.setName(UmlSemanticCommandUtil.getNewComponentName(umlModel));
      if (parentContainer instanceof Model) {
         parentContainer.getPackagedElements().add(newComponent);
      } else if (parentContainer != null) {
         parentContainer.getPackagedElements().add(newComponent);
      }
   }

   public Component getNewComponent() {
      return newComponent;
   }
}
