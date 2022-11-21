package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;

public class RemoveGeneralizationCompoundCommand extends CompoundCommand {

   public RemoveGeneralizationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Generalization generalization) {
      this.append(new RemoveGeneralizationSemanticCommand(domain, modelUri, generalization));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, generalization));

   }

}
