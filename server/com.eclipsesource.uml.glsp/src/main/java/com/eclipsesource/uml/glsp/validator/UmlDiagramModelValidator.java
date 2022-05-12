package com.eclipsesource.uml.glsp.validator;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.google.inject.Inject;
import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.validation.Marker;
import org.eclipse.glsp.server.features.validation.MarkerKind;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UmlDiagramModelValidator implements ModelValidator {

   @Inject
   protected GModelState modelState;

   @Override
   public List<Marker> validate(final GModelElement... elements) {
      List<Marker> markers = new ArrayList<>();

      UmlModelState umlModelState = UmlModelState.getModelState(modelState);

      for (GModelElement element : elements) {
         EObject semanticElement = umlModelState.getIndex().getSemantic(element.getId()).get();
         if (semanticElement instanceof Class) {
            markers.addAll(validateClassNode((Class) semanticElement));
         }
      }
      System.out.println(markers);
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
         System.out.println("NO ASSOCIATIONS PRESENT");
         return Optional.of(new Marker("Class Node needs to be connected",
               "Class nodes always need to be connected to an edge", semanticElement.getName(), MarkerKind.WARNING));
      }
      return Optional.empty();
   }
}
