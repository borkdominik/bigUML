package com.eclipsesource.uml.glsp.uml.usecase_diagram;

public class UseCaseContextMenuItemProvider { /*-

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
         case USECASE:
            contextMenu.addAll(useCaseDiagramNodes(position));
            if (selectedElementIds.size() == 2) {
               contextMenu.addAll(useCaseDiagramEdges(selectedElementIds.get(0), selectedElementIds.get(1)));
            }
      }
      return contextMenu;
   }

   // USECASE DIAGRAM
   public List<MenuItem> useCaseDiagramNodes(final GPoint position) {
      MenuItem createUseCase = new MenuItem(UseCaseTypes.USECASE, "Usecase",
         List.of(new CreateNodeOperation(UseCaseTypes.USECASE, position)), true);
      MenuItem createComponent = new MenuItem(UseCaseTypes.COMPONENT, "Component",
         List.of(new CreateNodeOperation(UseCaseTypes.COMPONENT, position)), true);
      MenuItem createActor = new MenuItem(UseCaseTypes.ACTOR, "Actor",
         List.of(new CreateNodeOperation(UseCaseTypes.ACTOR, position)), true);
      MenuItem createPackage = new MenuItem(UseCaseTypes.PACKAGE, "Package",
         List.of(new CreateNodeOperation(UseCaseTypes.PACKAGE, position)), true);

      MenuItem useCaseDiagramNodes = new MenuItem("useCaseDiagramNodes", "Nodes",
         Arrays.asList(createUseCase, createActor, createComponent, createPackage), "useCaseDiagramNodes");
      return Lists.newArrayList(useCaseDiagramNodes);
   }

   public List<MenuItem> useCaseDiagramEdges(final String sourceElementId, final String targetElementId) {
      MenuItem createGeneralization = new MenuItem(UseCaseTypes.GENERALIZATION, "Generalization",
         List.of(new CreateEdgeOperation(UseCaseTypes.GENERALIZATION, sourceElementId, targetElementId)), true);
      MenuItem createInclude = new MenuItem(UseCaseTypes.INCLUDE, "Include",
         List.of(new CreateEdgeOperation(UseCaseTypes.INCLUDE, sourceElementId, targetElementId)), true);
      MenuItem createExtend = new MenuItem(UseCaseTypes.EXTEND, "Extend",
         List.of(new CreateEdgeOperation(UseCaseTypes.EXTEND, sourceElementId, targetElementId)), true);
      MenuItem createAssociation = new MenuItem(UseCaseTypes.USECASE_ASSOCIATION, "Association",
         List.of(new CreateEdgeOperation(UseCaseTypes.USECASE_ASSOCIATION, sourceElementId, targetElementId)), true);

      MenuItem useCaseDiagramEdges = new MenuItem("useCaseDiagramEdges", "Edges",
         Arrays.asList(createGeneralization, createAssociation, createExtend, createInclude), "useCaseDiagramEdges");
      return Lists.newArrayList(useCaseDiagramEdges);
   }
   */
}
