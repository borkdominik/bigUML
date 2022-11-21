package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveEnumerationSemanticCommand extends UmlSemanticElementCommand {

   protected final Enumeration enumerationToRemove;

   public RemoveEnumerationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Enumeration enumerationToRemove) {
      super(domain, modelUri);
      this.enumerationToRemove = enumerationToRemove;
   }

   @Override
   protected void doExecute() {
      model.getPackagedElements().remove(enumerationToRemove);
   }

}
