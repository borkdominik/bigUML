package com.eclipsesource.uml.glsp.features.validation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.validation.Marker;
import org.eclipse.glsp.server.features.validation.MarkerKind;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlDiagramModelValidator implements ModelValidator {

   @Inject
   protected UmlModelState modelState;

   @Override
   public List<Marker> validate(final GModelElement... elements) {
      List<Marker> markers = new ArrayList<>();

      for (GModelElement element : elements) {
         EObject semanticElement = modelState.getIndex().getEObject(element.getId()).get();
         if (semanticElement instanceof Class) {
            markers.addAll(validateClassNode((Class) semanticElement));
         }
      }

      return markers;
   }

   private static List<Marker> validateClassNode(final Class semanticElement) {
      List<Marker> markers = new ArrayList<>();
      classNodeIsConnected(semanticElement).ifPresent(markers::add);
      return markers;
   }

   private static Optional<Marker> classNodeIsConnected(final Class semanticElement) {
      EList<Association> associations = semanticElement.getAssociations();
      if (associations.isEmpty()) {
         return Optional.of(new Marker("Class Node needs to be connected",
            "Class nodes always need to be connected to an edge", semanticElement.getName(), MarkerKind.WARNING));
      }
      return Optional.empty();
   }
}
