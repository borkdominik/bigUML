package com.eclipsesource.uml.modelserver.commands.statemachinediagram.region;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.StateMachine;
import org.eclipse.uml2.uml.UMLFactory;

public class AddRegionCommand extends UmlSemanticElementCommand {

   protected final Region newRegion;
   protected final String parentSemanticUriFragment;

   public AddRegionCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUriFragment) {
      super(domain, modelUri);
      this.newRegion = UMLFactory.eINSTANCE.createRegion();
      this.parentSemanticUriFragment = parentSemanticUriFragment;
   }

   @Override
   protected void doExecute() {
      newRegion.setName(UmlSemanticCommandUtil.getNewRegionName(umlModel));
      StateMachine parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, StateMachine.class);

      if (parentContainer != null) {
         parentContainer.getRegions().add(newRegion);
      }
   }

   public Region getNewRegion() {
      return newRegion;
   }
}
