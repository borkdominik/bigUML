package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddEdgeCommand;

public class AddGeneralizationCompoundCommand extends CompoundCommand {

   public AddGeneralizationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Classifier specific,
      final Classifier general) {

      var command = new AddGeneralizationSemanticCommand(domain, modelUri, specific,
         general);
      this.append(command);
      this.append(new UmlAddEdgeCommand(domain, modelUri, () -> command.getNewGeneralization()));
   }
}
