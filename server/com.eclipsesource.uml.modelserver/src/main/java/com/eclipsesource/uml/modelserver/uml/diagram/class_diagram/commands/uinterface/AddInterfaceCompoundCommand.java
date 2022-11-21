package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Interface;

public class AddInterfaceCompoundCommand extends CompoundCommand {

   public AddInterfaceCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint interfacePosition) {
      var command = new AddInterfaceSemanticCommand(domain, modelUri);
      this.append(command);
      Supplier<Interface> semanticResultSupplier = command::getNewInterface;
      this.append(new AddInterfaceNotationCommand(domain, modelUri, interfacePosition, semanticResultSupplier));
   }

}
