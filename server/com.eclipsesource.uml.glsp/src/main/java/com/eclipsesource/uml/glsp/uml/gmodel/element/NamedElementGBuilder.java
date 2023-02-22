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

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.CompartmentGBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.IconCssGBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.LabelGBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.SeparatorGBuilder;
import com.eclipsesource.uml.glsp.uml.utils.VisibilityKindUtils;

public interface NamedElementGBuilder<TSource extends NamedElement>
   extends LabelGBuilder, IconCssGBuilder, SeparatorGBuilder, CompartmentGBuilder {

   default GLabelBuilder nameBuilder(final NamedElement source) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix().appendTo(NameLabelSuffix.SUFFIX, idGenerator().getOrCreateId(source)))
         .text(source.getName());
   }

   default GLabelBuilder visibilityBuilder(final NamedElement source) {
      return textBuilder(source, VisibilityKindUtils.asSingleLabel(source.getVisibility()));
   }

   default GCompartment buildIconVisibilityName(final NamedElement source, final String cssProperty) {
      return compartmentBuilder(source)
         .layout(GConstants.Layout.HBOX)
         .add(iconFromCssPropertyBuilder(source, cssProperty).build())
         .add(visibilityBuilder(source).build())
         .add(nameBuilder(source).build())
         .build();
   }
}
