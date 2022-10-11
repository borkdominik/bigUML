package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.enumeration;

public class AddEnumerationShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Enumeration newEnumeration;

   public AddEnumerationShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.newEnumeration = null;
      this.semanticProxyUri = null;
   }

   public AddEnumerationShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddEnumerationShapeCommand(final EditingDomain domain, final URI modelUri, final Enumeration newEnumeration,
      final GPoint position) {
      this(domain, modelUri, position);
      this.newEnumeration = newEnumeration;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null && this.newEnumeration == null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(newEnumeration));
      }
      newShape.setSemanticElement(proxy);

      umlDiagram.getElements().add(newShape);
   }
      */
}
