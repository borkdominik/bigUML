package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.generalization;

public class AddClassGeneralizationEdgeCommand { /*- {

   protected String semanticProxyUri;
   protected Supplier<Generalization> generalizationSupplier;

   private AddClassGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.generalizationSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddClassGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri,
      final String semanticProxyUri) {
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
      */
}
