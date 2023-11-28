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
import java.util.Map;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.CombinedFragment;
import org.eclipse.uml2.uml.InteractionOperand;
import org.eclipse.uml2.uml.InteractionUse;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.core.gmodel.builder.CompartmentGBuilder;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionOperand;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.google.inject.Inject;

public class InteractionOperandNodeMapper extends BaseGNodeMapper<InteractionOperand, GNode>
   implements NamedElementGBuilder<InteractionOperand> {

   @Inject
   protected IdCountContextGenerator idCountGenerator;

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   @Override
   public GNode map(final InteractionOperand source) {

      var layoutOptions = new HashMap<String, Object>();
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);

      var builder = new GNodeBuilder(UmlSequence_InteractionOperand.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(createCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final InteractionOperand source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions().paddingTop(5)
            .paddingBottom(5.0)
            .paddingLeft(5)
            .paddingRight(5));
      header.add(textBuilder(source, "[").build());
      header.add(guardBuilder(source).build());
      header.add(textBuilder(source, "]").build());
      return header.build();
   }

   protected GLabelBuilder guardBuilder(final InteractionOperand source) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix().appendTo(NameLabelSuffix.SUFFIX, idGenerator().getOrCreateId(source)))
         .text(source.getGuard().getName()); // TODO: should be specificatio, not guard name
   }

   protected GCompartment createCompartment(final InteractionOperand source) {

      var combinedFragmentElements = source.getFragments().stream()
         .filter(f -> f instanceof CombinedFragment)
         .collect(Collectors.toList());

      var interactinoUseElements = source.getFragments().stream()
         .filter(f -> f instanceof InteractionUse)
         .collect(Collectors.toList());

      var children = new LinkedList<EObject>();
      children.addAll(combinedFragmentElements);
      children.addAll(interactinoUseElements);

      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .addAll(children.stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .build();
   }

   @Override
   protected void applyShapeNotation(final InteractionOperand source, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(source, Shape.class).ifPresent(shape -> {
         modelState.getIndex().getNotation(source.eContainer(), Shape.class).ifPresent(parentshape -> {
            var parentWidth = parentshape.getSize().getWidth();
            if (shape.getPosition() != null) {
               builder.position(GraphUtil.copy(shape.getPosition()));
            }
            if (shape.getSize() != null) {
               var size = GraphUtil.copy(shape.getSize());
               builder.size(size);
               builder.layoutOptions(Map.of(
                  GLayoutOptions.KEY_PREF_WIDTH, parentWidth,
                  GLayoutOptions.KEY_PREF_HEIGHT, size.getHeight()));
            }
         });
      });
   }

   protected boolean onlyChild(final InteractionOperand source) {
      return ((CombinedFragment) source.eContainer()).getOperands().size() == 1;
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
