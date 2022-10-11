package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.generalization;

public class AddGeneralizationEdgeCommand { /*- {

   protected String semanticProxyUri;
   protected Supplier<Generalization> generalizationSupplier;

   private AddGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.generalizationSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
      this(domain, modelUri);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri,
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
   }   */
}
