package com.eclipsesource.uml.modelserver.commands.activitydiagram.partition;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.ActivityPartition;

import java.util.function.Supplier;

public class AddPartitionShapeCommand extends UmlNotationElementCommand {

   protected Supplier<ActivityPartition> activityPartitionSupplier;
   protected final GPoint shapePosition;
   protected String semanticProxyUri;

   private AddPartitionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.activityPartitionSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddPartitionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddPartitionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<ActivityPartition> activityPartitionSupplier) {
      this(domain, modelUri, position);
      this.activityPartitionSupplier = activityPartitionSupplier;

   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);
      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(activityPartitionSupplier.get()));
      }
      newShape.setSemanticElement(proxy);
      umlDiagram.getElements().add(newShape);
   }
}
