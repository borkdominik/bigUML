package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Interface;

import java.util.function.Supplier;

public class AddInterfaceShapeCommand extends UmlNotationElementCommand {

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
}
