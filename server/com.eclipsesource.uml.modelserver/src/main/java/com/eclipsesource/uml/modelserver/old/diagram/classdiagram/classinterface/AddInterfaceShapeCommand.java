package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.classinterface;

public class AddInterfaceShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<Interface> interfaceSupplier;

   private AddInterfaceShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.interfaceSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddInterfaceShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddInterfaceShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<Interface> interfaceSupplier) {
      this(domain, modelUri, position);
      this.interfaceSupplier = interfaceSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(interfaceSupplier.get()));
      }
      newShape.setSemanticElement(proxy);

      umlDiagram.getElements().add(newShape);
   }
      */
}
