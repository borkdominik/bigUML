package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

public class AddComponentShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<PackageableElement> packageableElementSupplier;

   private AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.packageableElementSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<PackageableElement> supplier) {
      this(domain, modelUri, position);
      this.packageableElementSupplier = supplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(packageableElementSupplier.get()));
      }
      newShape.setSemanticElement(proxy);
      umlDiagram.getElements().add(newShape);
   }
   */
}
