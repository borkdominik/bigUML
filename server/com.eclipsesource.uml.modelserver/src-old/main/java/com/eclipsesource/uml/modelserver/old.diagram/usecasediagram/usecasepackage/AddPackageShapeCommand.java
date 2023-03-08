package com.eclipsesource.uml.modelserver.old.diagram.usecasediagram.usecasepackage;

public class AddPackageShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<PackageableElement> packageSupplier;

   private AddPackageShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.packageSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddPackageShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddPackageShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<PackageableElement> packageSupplier) {
      this(domain, modelUri, position);
      this.packageSupplier = packageSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(packageSupplier.get()));
      }
      newShape.setSemanticElement(proxy);

      umlDiagram.getElements().add(newShape);
   }   */
}
