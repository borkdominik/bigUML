/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.gmodel.builder;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;

import com.eclipsesource.uml.glsp.core.constants.UmlLayoutConstants;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;

@Deprecated(forRemoval = true)
public interface CompartmentGBuilder extends GIdContextGeneratorProvider {

   String childrenContainerKey = "children-container";

   default GCompartmentBuilder compartmentHeaderBuilder(final EObject source) {
      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT_HEADER)
         .id(idContextGenerator().getOrCreateId(source));
   }

   default GCompartmentBuilder compartmentBuilder(final EObject source) {
      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idContextGenerator().getOrCreateId(source));
   }

   default GCompartmentBuilder fixedChildrenCompartmentBuilder(final EObject source) {
      var options = new GLayoutOptions()
         .hAlign(GConstants.HAlign.LEFT)
         .resizeContainer(true);
      options.put("hGrab", true);
      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idContextGenerator().getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(options);
   }

   default GCompartmentBuilder freeformChildrenCompartmentBuilder(final EObject source) {
      return new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idContextGenerator().getOrCreateId(source))
         .addArgument(CompartmentGBuilder.childrenContainerKey, true)
         .addArgument("divider", true)
         .layout(UmlLayoutConstants.FREEFORM)
         .layoutOptions(new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true));
   }
}
