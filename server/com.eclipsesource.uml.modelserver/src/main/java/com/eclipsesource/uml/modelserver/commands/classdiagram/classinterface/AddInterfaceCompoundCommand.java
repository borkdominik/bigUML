package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Interface;

import java.util.function.Supplier;

public class AddInterfaceCompoundCommand extends CompoundCommand {

   public AddInterfaceCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint interfacePosition) {
      AddInterfaceCommand command = new AddInterfaceCommand(domain, modelUri);
      this.append(command);
      Supplier<Interface> semanticResultSupplier = command::getNewInterface;
      this.append(new AddInterfaceShapeCommand(domain, modelUri, interfacePosition, semanticResultSupplier));
   }
}
