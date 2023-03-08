package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.context_menu;

public class ClassContextMenuItemProvider {
   /*-
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
      MenuItem createClass = new MenuItem(UmlClass_Class.TYPE_ID, "Class",
         List.of(new CreateNodeOperation(UmlClass_Class.TYPE_ID, position)), true);
      MenuItem createEnumeration = new MenuItem(UmlClass_Enumeration.typeId(), "Enumeration",
         List.of(new CreateNodeOperation(UmlClass_Enumeration.typeId(), position)), true);
      MenuItem createInterface = new MenuItem(UmlClass_Interface.typeId(), "Interface",
         List.of(new CreateNodeOperation(UmlClass_Interface.typeId(), position)), true);
   
      MenuItem classDiagramNodes = new MenuItem("classDiagramNodes", "Nodes",
         Arrays.asList(createClass, createEnumeration, createInterface), "classDiagramNodes");
      return Lists.newArrayList(classDiagramNodes);
   }
   
   public List<MenuItem> classDiagramChildNodes(final String elementId, final UmlModelState umlModelState) {
      Optional<GModelElement> element = umlModelState.getIndex().get(elementId);
      String type = element.get().getType();
   
      if (Objects.equals(type, UmlClass_Class.TYPE_ID)) {
         MenuItem createProperty = new MenuItem(UmlClass_Property.typeId(), "Property",
            List.of(new CreateNodeOperation(UmlClass_Property.typeId(), elementId)), true);
   
         MenuItem childNodes = new MenuItem("classDiagramChildNodes", "Child Nodes",
            List.of(createProperty), "classDiagramChildNodes");
         return Lists.newArrayList(childNodes);
      }
      return Lists.newArrayList();
   }
   
   public List<MenuItem> classDiagramEdges(final String sourceElementId, final String targetElementId) {
      MenuItem createAssociation = new MenuItem(ClassTypes.ASSOCIATION, "Association",
         List.of(new CreateEdgeOperation(ClassTypes.ASSOCIATION, sourceElementId, targetElementId)), true);
      MenuItem createGeneralization = new MenuItem(UmlClass_Generalization.typeId(), "Generalization",
         List.of(new CreateEdgeOperation(UmlClass_Generalization.typeId(), sourceElementId, targetElementId)), true);
   
      MenuItem classDiagramEdges = new MenuItem("classDiagramEdges", "Edges",
         Arrays.asList(createAssociation, createGeneralization), "classDiagramEdges");
   
      return Lists.newArrayList(classDiagramEdges);
   }
   */
}
