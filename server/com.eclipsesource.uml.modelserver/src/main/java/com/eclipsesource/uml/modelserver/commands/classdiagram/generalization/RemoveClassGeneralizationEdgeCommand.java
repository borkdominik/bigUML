package com.eclipsesource.uml.modelserver.commands.classdiagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveClassGeneralizationEdgeCommand extends UmlNotationElementCommand {

   protected final Edge edgeToRemove;

   public RemoveClassGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri,
      final String semanticProxyUri) {
      super(domain, modelUri);
      this.edgeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Edge.class);
   }

   @Override
   protected void doExecute() {
      umlDiagram.getElements().remove(edgeToRemove);
   }
}
