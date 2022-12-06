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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel;

import java.util.Optional;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.features.idgenerator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.old.utils.property.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyIconSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyLabelMultiplicitySuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyLabelNameSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyLabelTypeSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public class PropertyCompartmentMapper extends BaseGModelMapper<Property, GCompartment> {
   @Inject
   protected IdCountContextGenerator idCountGenerator;

   @Override
   public GCompartment map(final Property property) {
      var builder = new GCompartmentBuilder(ClassTypes.PROPERTY)
         .id(idGenerator.getOrCreateId(property))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true))
         .add(buildIcon(property))
         .add(buildName(property));

      var separatorLabel = new GLabelBuilder(CoreTypes.LABEL_TEXT)
         .id(idCountGenerator.getOrCreateId(property))
         .text(":")
         .build();
      builder.add(separatorLabel);

      Optional.ofNullable(property.getType()).ifPresent(type -> {
         builder.add(buildTypeName(property, type));
      });

      var propertyMultiplicity = PropertyUtil.getMultiplicity(property);
      builder.add(
         new GLabelBuilder(CoreTypes.LABEL_TEXT).text("[")
            .id(idCountGenerator.getOrCreateId(property))
            .build())
         .add(buildTypeMultiplicity(property, propertyMultiplicity))
         .add(
            new GLabelBuilder(CoreTypes.LABEL_TEXT).text("]")
               .id(idCountGenerator.getOrCreateId(property))
               .build());

      return builder.build();
   }

   protected GCompartment buildIcon(final Property property) {
      return new GCompartmentBuilder(ClassTypes.ICON_PROPERTY)
         .id(suffix.appendTo(PropertyIconSuffix.SUFFIX, idGenerator.getOrCreateId(property)))
         .build();
   }

   protected GLabel buildName(final Property property) {
      return new GLabelBuilder(ClassTypes.LABEL_PROPERTY_NAME)
         .id(suffix.appendTo(PropertyLabelNameSuffix.SUFFIX, idGenerator.getOrCreateId(property)))
         .text(property.getName())
         .build();
   }

   protected GLabel buildTypeName(final Property property, final Type type) {
      return new GLabelBuilder(ClassTypes.LABEL_PROPERTY_TYPE)
         .id(suffix.appendTo(PropertyLabelTypeSuffix.SUFFIX, idGenerator.getOrCreateId(property)))
         .text(type.getName())
         .build();
   }

   protected GLabel buildTypeMultiplicity(final Property property, final String multiplicity) {
      return new GLabelBuilder(ClassTypes.LABEL_PROPERTY_MULTIPLICITY)
         .id(suffix.appendTo(PropertyLabelMultiplicitySuffix.SUFFIX, idGenerator.getOrCreateId(property)))
         .text(multiplicity)
         .build();
   }
}
