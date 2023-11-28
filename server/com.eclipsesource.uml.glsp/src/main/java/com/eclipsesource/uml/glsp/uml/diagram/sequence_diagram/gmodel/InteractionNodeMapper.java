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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.InteractionUse;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.gmodel.builder.CompartmentGBuilder;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Interaction;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class InteractionNodeMapper extends BaseGNodeMapper<Interaction, GNode>
   implements NamedElementGBuilder<Interaction> {
   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   @Override
   public GNode map(final Interaction source) {

      var layoutOptions = new HashMap<String, Object>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, false);
      layoutOptions.put(V_GRAB, false);

      var builder = new GNodeBuilder(UmlSequence_Interaction.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(createCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final Interaction source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.HBOX);

      if (source.isAbstract()) {
         header.addCssClass("abstract");
      }

      header.add(buildIconName(source, "--uml-interaction-icon"));

      return header.build();
   }

   protected GCompartment createCompartment(final Interaction interaction) {

      var layoutOptions = new HashMap<String, Object>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);

      var combinedFragmentElements = interaction.getFragments().stream()
         .filter(f -> f instanceof CombinedFragment)
         .collect(Collectors.toList());

      var interactionUseElements = interaction.getFragments().stream()
         .filter(f -> f instanceof InteractionUse)
         .collect(Collectors.toList());

      var children = new LinkedList<EObject>();
      children.addAll(combinedFragmentElements);
      children.addAll(interactionUseElements);
      children.addAll(interaction.getLifelines());
      children.addAll(interaction.getMessages());

      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(interaction))
         .layout(GConstants.Layout.FREEFORM)
         .layoutOptions(layoutOptions)
         .addAll(children.stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(children.stream()
            .map(mapHandler::handleSiblings)
            .flatMap(List::stream)
            .collect(Collectors.toList()))
         .build();
   }

   @Override
   public GCompartmentBuilder freeformChildrenCompartmentBuilder(final EObject source) {
      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idContextGenerator().getOrCreateId(source))
         .addArgument(CompartmentGBuilder.childrenContainerKey, true)
         .layout(GConstants.Layout.FREEFORM)
         .layoutOptions(new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true));
   }
}
