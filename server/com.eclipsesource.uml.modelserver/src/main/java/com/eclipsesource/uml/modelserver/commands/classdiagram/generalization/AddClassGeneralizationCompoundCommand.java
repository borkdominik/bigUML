package com.eclipsesource.uml.modelserver.commands.classdiagram.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

import java.util.function.Supplier;

public class AddClassGeneralizationCompoundCommand extends CompoundCommand {

   public AddClassGeneralizationCompoundCommand(final EditingDomain domain, final URI modelUri, final String generalClass,
                                                final String specificClass) {

      AddClassGeneralizationCommand command = new AddClassGeneralizationCommand(domain, modelUri, generalClass,
            specificClass);
      this.append(command);
      Supplier<Generalization> semanticResultSupplier = command::getNewGeneralization;
      this.append(new AddClassGeneralizationEdgeCommand(domain, modelUri, semanticResultSupplier));
   }
}
