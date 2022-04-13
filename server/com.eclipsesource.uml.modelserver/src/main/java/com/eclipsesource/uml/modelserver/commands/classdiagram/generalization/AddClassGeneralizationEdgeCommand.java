package com.eclipsesource.uml.modelserver.commands.classdiagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;

import java.util.function.Supplier;

public class AddClassGeneralizationEdgeCommand extends UmlNotationElementCommand {

   protected String semanticProxyUri;
   protected Supplier<Generalization> generalizationSupplier;

   private AddClassGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.generalizationSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddClassGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
      this(domain, modelUri);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddClassGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri,
                                            final Supplier<Generalization> generalizationSupplier) {
      this(domain, modelUri);
      this.generalizationSupplier = generalizationSupplier;
   }

   @Override
   protected void doExecute() {
      Edge newEdge = UnotationFactory.eINSTANCE.createEdge();
      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(generalizationSupplier.get()));
      }
      newEdge.setSemanticElement(proxy);
      umlDiagram.getElements().add(newEdge);
   }
}
