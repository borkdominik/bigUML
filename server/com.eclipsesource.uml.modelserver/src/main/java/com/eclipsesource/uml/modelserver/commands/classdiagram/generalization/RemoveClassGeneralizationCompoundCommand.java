package com.eclipsesource.uml.modelserver.commands.classdiagram.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveClassGeneralizationCompoundCommand extends CompoundCommand {

   public RemoveClassGeneralizationCompoundCommand(final EditingDomain domain, final URI modelUri,
                                                   final String semanticUriFragment) {
      this.append(new RemoveClassGeneralizationCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveClassGeneralizationEdgeCommand(domain, modelUri, semanticUriFragment));

   }

}
