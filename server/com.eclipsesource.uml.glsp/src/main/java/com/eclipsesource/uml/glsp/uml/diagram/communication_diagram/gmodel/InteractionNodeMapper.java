/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Interaction;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;

public class InteractionNodeMapper extends BaseGNodeMapper<Interaction, GNode> {
   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   @Override
   public GNode map(final Interaction source) {
      var layoutOptions = new HashMap<String, Object>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      var builder = new GNodeBuilder(UmlCommunication_Interaction.TYPE_ID)
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Interaction source) {
      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT_HEADER)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .add(new GCompartmentBuilder(UmlCommunication_Interaction.ICON)
            .id(idCountGenerator.getOrCreateId(source))
            .build())
         .add(new GLabelBuilder(CoreTypes.LABEL_NAME)
            .id(suffix.appendTo(NameLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)))
            .text(source.getName())
            .build())
         .build();
   }

   protected GCompartment buildCompartment(final Interaction source) {
      var children = new LinkedList<EObject>();
      children.addAll(source.getLifelines());
      children.addAll(source.getMessages());

      var layoutOptions = new HashMap<String, Object>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);

      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.FREEFORM)
         .layoutOptions(layoutOptions)
         .addAll(children.stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .build();
   }
}
