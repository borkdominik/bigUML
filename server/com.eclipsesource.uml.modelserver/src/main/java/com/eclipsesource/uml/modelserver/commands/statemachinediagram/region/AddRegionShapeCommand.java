package com.eclipsesource.uml.modelserver.commands.statemachinediagram.region;

public class AddRegionShapeCommand { /*- {

   protected Supplier<Region> regionSupplier;
   protected final GPoint shapePosition;
   protected String semanticProxyUri;

   private AddRegionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.regionSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddRegionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddRegionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<Region> regionSupplier) {
      this(domain, modelUri, position);
      this.regionSupplier = regionSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);
      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(regionSupplier.get()));
      }
      newShape.setSemanticElement(proxy);
      umlDiagram.getElements().add(newShape);
   }   */
}
