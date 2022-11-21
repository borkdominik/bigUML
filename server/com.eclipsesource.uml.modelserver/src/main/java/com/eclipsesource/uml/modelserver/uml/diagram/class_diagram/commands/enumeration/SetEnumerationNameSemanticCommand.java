package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Enumeration;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class SetEnumerationNameSemanticCommand extends UmlSemanticElementCommand {

   protected Enumeration enumeration;
   protected String newName;

   public SetEnumerationNameSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Enumeration enumeration,
      final String newName) {
      super(domain, modelUri);
      this.enumeration = enumeration;
      this.newName = newName;
   }

   @Override
   protected void doExecute() {
      enumeration.setName(newName);
   }

}
