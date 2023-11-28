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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.InteractionUse;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.builder.CompartmentGBuilder;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionUse;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class InteractionUseNodeMapper extends BaseGNodeMapper<InteractionUse, GNode>
   implements NamedElementGBuilder<InteractionUse> {

   private static final String V_GRAB = "vGrab";
   private static final String H_GRAB = "hGrab";
   private static final String H_ALIGN = "hAlign";

   @Override
   public GNode map(final InteractionUse source) {

      var layoutOptions = new HashMap<String, Object>();
      layoutOptions.put(H_ALIGN, GConstants.HAlign.LEFT);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);

      var builder = new GNodeBuilder(UmlSequence_InteractionUse.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(createCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   protected GCompartment buildHeader(final InteractionUse source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.HBOX);
      header.add(buildIconName(source, "--uml-interaction-use-icon"));
      return header.build();
   }

   protected GCompartment createCompartment(final InteractionUse source) {

      GLayoutOptions layoutOptions = new GLayoutOptions();
      layoutOptions.hAlign(GConstants.HAlign.CENTER);
      layoutOptions.put(H_GRAB, true);
      layoutOptions.put(V_GRAB, true);

      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(layoutOptions)
         .add(refNameBuilder(source).build())
         .build();
   }

   public GCompartment buildIconName(final InteractionUse source, final String cssProperty) {
      return compartmentBuilder(source)
         .layout(GConstants.Layout.HBOX)
         .add(iconFromCssPropertyBuilder(source, cssProperty).build())
         .add(nameBuilder(source).build())
         .build();
   }

   public GLabelBuilder nameBuilder(final InteractionUse source) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix().appendTo(NameLabelSuffix.SUFFIX, idGenerator().getOrCreateId(source)))
         .text("ref");
   }

   public GLabelBuilder refNameBuilder(final InteractionUse source) {
      var refName = "none";
      if (source.getRefersTo() == null) {
         refName = source.getName();
      }
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix().appendTo(NameLabelSuffix.SUFFIX, idGenerator().getOrCreateId(source) + "ref"))
         .text(refName);
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
