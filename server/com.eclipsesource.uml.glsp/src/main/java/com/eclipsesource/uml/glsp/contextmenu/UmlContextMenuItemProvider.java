package com.eclipsesource.uml.glsp.contextmenu;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.contextmenu.MenuItem;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;
import com.google.inject.Inject;

public class UmlContextMenuItemProvider implements ContextMenuItemProvider {

   @Inject
   protected UmlModelState modelState;

   @Override
   public List<MenuItem> getItems(final List<String> selectedElementIds, final GPoint position,
      final Map<String, String> args) {

      Representation diagramType = modelState.getUmlNotationModel().getRepresentation();

      List<MenuItem> contextMenu = Lists.newArrayList();

      return contextMenu;
   }
}
