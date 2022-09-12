/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.GShapeElement;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.features.core.model.GModelFactory;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.gmodel.DiagramFactory;
import com.eclipsesource.uml.glsp.gmodel.DiagramFactoryProvider;
import com.eclipsesource.uml.modelserver.unotation.Diagram;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.NotationElement;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import com.google.common.base.Preconditions;
import com.google.inject.Inject;

public class UmlModelFactory implements GModelFactory {

   @Inject
   protected GModelState gModelState;

   @Override
   public void createGModel() {
      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      DiagramFactory gModelFactory = DiagramFactoryProvider.get(modelState);

      GModelRoot gmodelRoot = gModelFactory.createRoot(modelState);

      UmlModelIndex modelIndex = modelState.getIndex();
      modelIndex.clear();

      Model semanticModel = modelState.getSemanticModel();
      EcoreUtil.resolveAll(semanticModel);
      Diagram diagram = modelState.getNotationModel();
      getOrCreateDiagram(diagram, semanticModel, modelIndex);

      gmodelRoot = gModelFactory.create();
      initialize(gmodelRoot, modelIndex, semanticModel, diagram);

      modelState.setRoot(gmodelRoot);
   }

   private Diagram getOrCreateDiagram(final Diagram diagram, final Model umlModel, final UmlModelIndex modelIndex) {
      if (diagram == null) {
         createDiagram(umlModel);
      }
      findUnresolvedElements(diagram, umlModel)
         .forEach(e -> e.setSemanticElement(resolved(e.getSemanticElement(), umlModel)));
      modelIndex.indexNotation(diagram);
      return diagram;
   }

   private Diagram createDiagram(final Model umlModel) {
      Diagram diagram = UnotationFactory.eINSTANCE.createDiagram();
      diagram.setSemanticElement(createProxy(umlModel));
      return diagram;
   }

   public Diagram initialize(final GModelRoot gRoot, final UmlModelIndex modelIndex, final Model umlModel,
      final Diagram diagram) {
      Preconditions.checkArgument(diagram.getSemanticElement().getResolvedElement() == umlModel);
      gRoot.getChildren().forEach(child -> {
         modelIndex.getNotation(child).ifPresentOrElse(n -> updateNotationElement(n, child),
            () -> initializeNotationElement(child, modelIndex).ifPresent(diagram.getElements()::add));
      });
      return diagram;
   }

   private Optional<? extends NotationElement> initializeNotationElement(final GModelElement gModelElement,
      final UmlModelIndex modelIndex) {
      Optional<? extends NotationElement> result = Optional.empty();
      if (gModelElement instanceof GNode) {
         result = initializeShape((GNode) gModelElement, modelIndex);
      } else if (gModelElement instanceof GEdge) {
         result = initializeEdge((GEdge) gModelElement, modelIndex);
      }
      return result;
   }

   private List<NotationElement> findUnresolvedElements(final Diagram diagram, final Model umlModel) {
      List<NotationElement> unresolved = new ArrayList<>();

      if (diagram.getSemanticElement() == null
         || resolved(diagram.getSemanticElement(), umlModel).getResolvedElement() == null) {
         unresolved.add(diagram);
      }

      unresolved.addAll(diagram.getElements().stream()
         .filter(element -> element.getSemanticElement() == null ? false
            : resolved(element.getSemanticElement(), umlModel).getResolvedElement() == null)
         .collect(Collectors.toList()));

      return unresolved;
   }

   private Optional<Shape> initializeShape(final GShapeElement shapeElement, final UmlModelIndex modelIndex) {
      return modelIndex.getSemantic(shapeElement)
         .map(semanticElement -> initializeShape(semanticElement, shapeElement, modelIndex));
   }

   private Shape initializeShape(final EObject semanticElement, final GShapeElement shapeElement,
      final UmlModelIndex modelIndex) {
      Shape shape = UnotationFactory.eINSTANCE.createShape();
      shape.setSemanticElement(createProxy(semanticElement));
      if (shapeElement != null) {
         updateShape(shape, shapeElement);
      }
      modelIndex.indexNotation(shape);
      return shape;
   }

   private Optional<Edge> initializeEdge(final GEdge gEdge, final UmlModelIndex modelIndex) {
      return modelIndex.getSemantic(gEdge).map(semanticElement -> initializeEdge(semanticElement, gEdge, modelIndex));
   }

   private Edge initializeEdge(final EObject semanticElement, final GEdge gEdge, final UmlModelIndex modelIndex) {
      Edge edge = UnotationFactory.eINSTANCE.createEdge();
      edge.setSemanticElement(createProxy(semanticElement));
      if (gEdge != null) {
         updateEdge(edge, gEdge);
      }
      modelIndex.indexNotation(edge);
      return edge;
   }

   private SemanticProxy createProxy(final EObject eObject) {
      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      proxy.setResolvedElement(eObject);
      proxy.setUri(EcoreUtil.getURI(eObject).fragment().toString());
      return proxy;
   }

   private SemanticProxy resolved(final SemanticProxy proxy, final Model umlModel) {
      if (proxy.getResolvedElement() != null) {
         return proxy;
      }
      return reResolved(proxy, umlModel);
   }

   private SemanticProxy reResolved(final SemanticProxy proxy, final Model umlModel) {
      // The xmi:id is used as URI to identify UML elements, we use the underlying resource to fetch uml elements by id
      proxy.setResolvedElement(umlModel.eResource().getEObject(proxy.getUri()));
      return proxy;
   }

   private void updateNotationElement(final NotationElement notation, final GModelElement modelElement) {
      if (notation instanceof Shape && modelElement instanceof GShapeElement) {
         updateShape((Shape) notation, (GShapeElement) modelElement);
      } else if (notation instanceof Edge && modelElement instanceof GEdge) {
         updateEdge((Edge) notation, (GEdge) modelElement);
      }
   }

   private void updateShape(final Shape shape, final GShapeElement shapeElement) {
      if (shapeElement.getSize() != null) {
         shape.setSize(GraphUtil.copy(shapeElement.getSize()));
      }
      if (shapeElement.getPosition() != null) {
         shape.setPosition(GraphUtil.copy(shapeElement.getPosition()));
      } else if (shape.getPosition() != null) {
         shapeElement.setPosition(GraphUtil.copy(shape.getPosition()));
      }
   }

   private void updateEdge(final Edge edge, final GEdge gEdge) {
      edge.getBendPoints().clear();
      if (gEdge.getRoutingPoints() != null) {
         ArrayList<GPoint> gPoints = new ArrayList<>();
         gEdge.getRoutingPoints().forEach(p -> gPoints.add(GraphUtil.copy(p)));
         edge.getBendPoints().addAll(gPoints);
      }
   }

}
