/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.common_diagram.palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.palette.DiagramPalette;
import com.eclipsesource.uml.glsp.uml.common_diagram.configuration.CommonCommonConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.common_diagram.constants.CommonTypes;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;
import com.google.inject.Inject;

public class CommonPalette implements DiagramPalette {

   @Inject
   private CommonCommonConfigurationAccessor configurationAccessor;

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      if (configurationAccessor.getActive().isPresent()) {
         return List.of(comment());
      }
      return List.of();
   }

   private PaletteItem comment() {
      PaletteItem createCommentNode = node(CommonTypes.COMMENT, "Comment", "umlcomment");
      // PaletteItem createCommentEdge = node(Types.COMMENT_EDGE, "Comment Edge", "umlcommentedge");

      List<PaletteItem> comment = Lists.newArrayList(createCommentNode);
      return PaletteItem.createPaletteGroup("uml.comment", "Comment", comment, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

   @Override
   public boolean supports(final Representation representation) {
      return representation == Representation.COMMUNICATION;
   }

}
