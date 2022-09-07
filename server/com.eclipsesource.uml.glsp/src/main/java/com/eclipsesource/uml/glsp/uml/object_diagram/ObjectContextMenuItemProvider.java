package com.eclipsesource.uml.glsp.uml.object_diagram;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.contextmenu.MenuItem;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.CreateNodeOperation;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;
import com.google.inject.Inject;

public class ObjectContextMenuItemProvider implements ContextMenuItemProvider {

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
         case ACTIVITY:
         case OBJECT:
         case USECASE:
            contextMenu.addAll(useCaseDiagramNodes(position));
            if (selectedElementIds.size() == 2) {
               contextMenu.addAll(useCaseDiagramEdges(selectedElementIds.get(0), selectedElementIds.get(1)));
            }
         case DEPLOYMENT:
         case STATEMACHINE:
            return contextMenu;

      }
      return contextMenu;
   }

   // USECASE DIAGRAM
   public List<MenuItem> useCaseDiagramNodes(final GPoint position) {
      MenuItem createUseCase = new MenuItem(Types.USECASE, "Usecase",
         List.of(new CreateNodeOperation(Types.USECASE, position)), true);
      MenuItem createComponent = new MenuItem(Types.COMPONENT, "Component",
         List.of(new CreateNodeOperation(Types.COMPONENT, position)), true);
      MenuItem createActor = new MenuItem(Types.ACTOR, "Actor",
         List.of(new CreateNodeOperation(Types.ACTOR, position)), true);
      MenuItem createPackage = new MenuItem(Types.PACKAGE, "Package",
         List.of(new CreateNodeOperation(Types.PACKAGE, position)), true);

      MenuItem useCaseDiagramNodes = new MenuItem("useCaseDiagramNodes", "Nodes",
         Arrays.asList(createUseCase, createActor, createComponent, createPackage), "useCaseDiagramNodes");
      return Lists.newArrayList(useCaseDiagramNodes);
   }

   public List<MenuItem> useCaseDiagramEdges(final String sourceElementId, final String targetElementId) {
      MenuItem createGeneralization = new MenuItem(Types.GENERALIZATION, "Generalization",
         List.of(new CreateEdgeOperation(Types.GENERALIZATION, sourceElementId, targetElementId)), true);
      MenuItem createInclude = new MenuItem(Types.INCLUDE, "Include",
         List.of(new CreateEdgeOperation(Types.INCLUDE, sourceElementId, targetElementId)), true);
      MenuItem createExtend = new MenuItem(Types.EXTEND, "Extend",
         List.of(new CreateEdgeOperation(Types.EXTEND, sourceElementId, targetElementId)), true);
      MenuItem createAssociation = new MenuItem(Types.USECASE_ASSOCIATION, "Association",
         List.of(new CreateEdgeOperation(Types.USECASE_ASSOCIATION, sourceElementId, targetElementId)), true);

      MenuItem useCaseDiagramEdges = new MenuItem("useCaseDiagramEdges", "Edges",
         Arrays.asList(createGeneralization, createAssociation, createExtend, createInclude), "useCaseDiagramEdges");
      return Lists.newArrayList(useCaseDiagramEdges);
   }

}
