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
package com.eclipsesource.uml.glsp.uml.gmodel.element;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdgePlacement;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.CompartmentGBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.IconCssGBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.LabelGBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.SeparatorGBuilder;

public interface EdgeGBuilder
   extends LabelGBuilder, IconCssGBuilder, SeparatorGBuilder, CompartmentGBuilder {

   default GLabelBuilder nameBuilder(final NamedElement source) {
      return nameBuilder(
         source,
         new GEdgePlacementBuilder()
            .side(GConstants.EdgeSide.TOP)
            .position(0.5d)
            .build());
   }

   default GLabelBuilder nameBuilder(final NamedElement source, final GEdgePlacement placement) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix().appendTo(NameLabelSuffix.SUFFIX, idGenerator().getOrCreateId(source)))
         .edgePlacement(placement)
         .text(source.getName());
   }

   default GLabelBuilder textEdgeBuilder(final EObject source, final String text, final GEdgePlacement placement) {
      return textEdgeBuilder(CoreTypes.LABEL_TEXT, idContextGenerator().getOrCreateId(source), text, placement);
   }

   default GLabelBuilder textEdgeBuilder(final String type, final String id, final String text,
      final GEdgePlacement placement) {
      return new GLabelBuilder(type)
         .id(id)
         .edgePlacement(placement)
         .text(text);
   }

}
