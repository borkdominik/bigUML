package com.eclipsesource.uml.glsp.uml.class_diagram;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.contextmenu.MenuItem;
import org.eclipse.glsp.server.features.validation.RequestMarkersAction;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.CreateNodeOperation;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;
import com.google.inject.Inject;

public class ClassContextMenuItemProvider implements ContextMenuItemProvider {

   @Inject
   protected GModelState modelState;

   @Override
   public List<MenuItem> getItems(final List<String> selectedElementIds, final GPoint position,
      final Map<String, String> args) {
      if (modelState.isReadonly()) {
         return Collections.emptyList();
      }

      UmlModelState umlModelState = UmlModelState.getModelState(modelState);
      Representation diagramType = UmlModelState.getModelState(umlModelState).getNotationModel().getDiagramType();

      List<MenuItem> contextMenu = Lists.newArrayList();

      switch (diagramType) {
         case CLASS:
            // if no element is selected the user can add new nodes
            if (selectedElementIds.size() == 0) {
               contextMenu.addAll(classDiagramNodes(position));
            }
            // if one node is selected the user can add child nodes
            if (selectedElementIds.size() == 1) {
               contextMenu.addAll(classDiagramChildNodes(selectedElementIds.get(0), umlModelState));
            }
            // only enable the new context menu if user selected two nodes
            if (selectedElementIds.size() == 2) {
               contextMenu.addAll(classDiagramEdges(selectedElementIds.get(0), selectedElementIds.get(1)));
            }
            // adding validation as permanent option to the context menu
            MenuItem validate = new MenuItem("validate", "Validation",
               List.of(new RequestMarkersAction(selectedElementIds)), true);
            contextMenu.add(validate);
            return contextMenu;
      }
      return contextMenu;
   }

   // CLASS DIAGRAM
   public List<MenuItem> classDiagramNodes(final GPoint position) {
      MenuItem createClass = new MenuItem(ClassTypes.CLASS, "Class",
         List.of(new CreateNodeOperation(ClassTypes.CLASS, position)), true);
      MenuItem createEnumeration = new MenuItem(ClassTypes.ENUMERATION, "Enumeration",
         List.of(new CreateNodeOperation(ClassTypes.ENUMERATION, position)), true);
      MenuItem createInterface = new MenuItem(ClassTypes.INTERFACE, "Interface",
         List.of(new CreateNodeOperation(ClassTypes.INTERFACE, position)), true);

      MenuItem classDiagramNodes = new MenuItem("classDiagramNodes", "Nodes",
         Arrays.asList(createClass, createEnumeration, createInterface), "classDiagramNodes");
      return Lists.newArrayList(classDiagramNodes);
   }

   public List<MenuItem> classDiagramChildNodes(final String elementId, final UmlModelState umlModelState) {
      Optional<GModelElement> element = umlModelState.getIndex().get(elementId);
      String type = element.get().getType();

      if (Objects.equals(type, ClassTypes.CLASS)) {
         MenuItem createProperty = new MenuItem(ClassTypes.PROPERTY, "Property",
            List.of(new CreateNodeOperation(ClassTypes.PROPERTY, elementId)), true);

         MenuItem childNodes = new MenuItem("classDiagramChildNodes", "Child Nodes",
            List.of(createProperty), "classDiagramChildNodes");
         return Lists.newArrayList(childNodes);
      }
      return Lists.newArrayList();
   }

   public List<MenuItem> classDiagramEdges(final String sourceElementId, final String targetElementId) {
      MenuItem createAssociation = new MenuItem(ClassTypes.ASSOCIATION, "Association",
         List.of(new CreateEdgeOperation(ClassTypes.ASSOCIATION, sourceElementId, targetElementId)), true);
      MenuItem createGeneralization = new MenuItem(ClassTypes.CLASS_GENERALIZATION, "Generalization",
         List.of(new CreateEdgeOperation(ClassTypes.CLASS_GENERALIZATION, sourceElementId, targetElementId)), true);

      MenuItem classDiagramEdges = new MenuItem("classDiagramEdges", "Edges",
         Arrays.asList(createAssociation, createGeneralization), "classDiagramEdges");

      return Lists.newArrayList(classDiagramEdges);
   }
}
