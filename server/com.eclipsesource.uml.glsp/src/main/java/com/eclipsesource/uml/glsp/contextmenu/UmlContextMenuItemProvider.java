package com.eclipsesource.uml.glsp.contextmenu;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.contextmenu.MenuItem;

import com.google.common.collect.Lists;

public class UmlContextMenuItemProvider implements ContextMenuItemProvider {

   @Override
   public List<MenuItem> getItems(final List<String> selectedElementIds, final GPoint position,
      final Map<String, String> args) {

      List<MenuItem> contextMenu = Lists.newArrayList();

      return contextMenu;
   }
}
