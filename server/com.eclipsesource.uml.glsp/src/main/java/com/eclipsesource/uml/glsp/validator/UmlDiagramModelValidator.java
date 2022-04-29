package com.eclipsesource.uml.glsp.validator;

import com.google.inject.Inject;
import org.eclipse.emf.common.util.EList;
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
      System.out.println("TRIGGERED");
      List<Marker> markers = new ArrayList<>();

      for (GModelElement element : elements) {
         if (element instanceof Class) {
            markers.addAll(validateClassNode(modelState, element));
         }
      }
      System.out.println(markers);
      return markers;
   }

   public static List<Marker> validateClassNode(final GModelState modelState, final GModelElement element) {
      List<Marker> markers = new ArrayList<>();
      classNodeIsConnected(modelState, element).ifPresent(markers::add);
      return markers;
   }

   private static Optional<Marker> classNodeIsConnected(final GModelState modelState, final GModelElement element) {
      Class classNode = (Class) element;

      EList<Association> associations = classNode.getAssociations();
      if (associations.isEmpty()) {
         return Optional.of(new Marker("Class Node needs to be connected",
               "Class nodes always need to be connected to an edge", element.getId(), MarkerKind.WARNING));
      }
      return Optional.empty();
   }
}
