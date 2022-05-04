package com.eclipsesource.uml.glsp.contextmenu;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;
import com.google.inject.Inject;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.contextmenu.MenuItem;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.CreateNodeOperation;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class UmlContextMenuItemProvider implements ContextMenuItemProvider {

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


      if (diagramType == Representation.CLASS) {
         MenuItem createClass = new MenuItem(Types.CLASS, "Class",
               Arrays.asList(new CreateNodeOperation(Types.CLASS, position)), true);
         MenuItem createEnumeration = new MenuItem(Types.ENUMERATION, "Enumeration",
               Arrays.asList(new CreateNodeOperation(Types.ENUMERATION, position)), true);
         MenuItem createInterface = new MenuItem(Types.INTERFACE, "Interface",
               Arrays.asList(new CreateNodeOperation(Types.INTERFACE, position)), true);

         return Lists.newArrayList(createClass, createInterface, createEnumeration);
      }

      // TODO: other diagram types
      return Lists.newArrayList();
   }
}
