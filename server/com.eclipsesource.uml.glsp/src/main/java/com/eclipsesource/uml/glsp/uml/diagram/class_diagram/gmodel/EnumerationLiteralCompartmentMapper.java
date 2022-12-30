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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.EnumerationLiteral;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.features.idgenerator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.IconSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.LabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public final class EnumerationLiteralCompartmentMapper extends BaseGModelMapper<EnumerationLiteral, GCompartment> {
   @Inject
   protected IdCountContextGenerator idCountGenerator;

   @Override
   public GCompartment map(final EnumerationLiteral literal) {
      var builder = new GCompartmentBuilder(ClassTypes.ENUMERATION_LITERAL)
         .id(idGenerator.getOrCreateId(literal))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true))
         .add(buildIcon(literal))
         .add(buildName(literal));

      return builder.build();
   }

   protected GCompartment buildIcon(final EnumerationLiteral literal) {
      return new GCompartmentBuilder(ClassTypes.ICON_ENUMERATION_LITERAL)
         .id(suffix.appendTo(IconSuffix.SUFFIX, idGenerator.getOrCreateId(literal)))
         .build();
   }

   protected GLabel buildName(final EnumerationLiteral literal) {
      return new GLabelBuilder(CoreTypes.LABEL_NAME)
         .id(suffix.appendTo(LabelSuffix.SUFFIX, idGenerator.getOrCreateId(literal)))
         .text(literal.getName())
         .build();
   }
}
