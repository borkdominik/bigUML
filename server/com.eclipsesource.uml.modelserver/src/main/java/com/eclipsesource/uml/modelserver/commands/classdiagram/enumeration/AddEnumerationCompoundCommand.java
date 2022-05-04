package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.UMLFactory;

public class AddEnumerationCompoundCommand extends CompoundCommand {

   public AddEnumerationCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      Enumeration newEnumeration = UMLFactory.eINSTANCE.createEnumeration();
      this.append(new AddEnumerationCommand(domain, modelUri, newEnumeration));
      this.append(new AddEnumerationShapeCommand(domain, modelUri, newEnumeration, position));
   }
}
