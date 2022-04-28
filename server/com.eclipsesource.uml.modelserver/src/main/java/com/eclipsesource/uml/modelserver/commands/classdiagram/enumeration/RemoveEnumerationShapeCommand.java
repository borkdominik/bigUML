package com.eclipsesource.uml.modelserver.commands.classdiagram.enumeration;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveEnumerationShapeCommand extends UmlNotationElementCommand {

   protected final Shape shapeToRemove;

   public RemoveEnumerationShapeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
      super(domain, modelUri);
      this.shapeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Shape.class);
   }

   @Override
   protected void doExecute() {
      umlDiagram.getElements().remove(shapeToRemove);
   }
}
