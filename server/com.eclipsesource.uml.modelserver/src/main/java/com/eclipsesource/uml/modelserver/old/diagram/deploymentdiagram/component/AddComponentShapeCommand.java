package com.eclipsesource.uml.modelserver.old.diagram.deploymentdiagram.component;

public class AddComponentShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<Component> componentSupplier;

   private AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.componentSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<Component> componentSupplier) {
      this(domain, modelUri, position);
      this.componentSupplier = componentSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(componentSupplier.get()));
      }

      newShape.setSemanticElement(proxy);
      umlDiagram.getElements().add(newShape);
   }
      */
}
