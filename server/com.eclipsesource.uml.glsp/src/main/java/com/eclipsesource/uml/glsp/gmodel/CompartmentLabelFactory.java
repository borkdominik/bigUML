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
package com.eclipsesource.uml.glsp.gmodel;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.glsp.util.UmlLabelUtil;

public class CompartmentLabelFactory extends AbstractGModelFactory<NamedElement, GCompartment> {

   public CompartmentLabelFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GCompartment create(final NamedElement namedElement) {
      if (namedElement instanceof Property) {
         return createPropertyLabel((Property) namedElement);
      }
      return null;
   }

   public GCompartment createPropertyLabel(final Property property) {
      GCompartmentBuilder propertyBuilder = new GCompartmentBuilder(Types.PROPERTY)
         .layout(GConstants.Layout.HBOX)
         .id(UmlIDUtil.createPropertyId(toId(property)));

      // property icon
      GCompartment propertyIcon = new GCompartmentBuilder(Types.ICON_PROPERTY)
         .id(UmlIDUtil.createPropertyIconId(toId(property))).build();
      propertyBuilder.add(propertyIcon);

      GLayoutOptions layoutOptions = new GLayoutOptions()
         .hGap(3)
         .resizeContainer(true);
      propertyBuilder.layoutOptions(layoutOptions);

      // property name
      GLabel propertyNameLabel = new GLabelBuilder(Types.LABEL_PROPERTY_NAME)
         .id(UmlIDUtil.createPropertyLabelNameId(toId(property)))
         .text(property.getName())
         .build();
      propertyBuilder.add(propertyNameLabel);

      // separator
      GLabel separatorLabel = new GLabelBuilder(Types.LABEL_TEXT)
         .text(":")
         .build();
      propertyBuilder.add(separatorLabel);

      // property type
      String propertyType = UmlLabelUtil.getTypeName(property);
      if (!propertyType.isBlank()) {
         GLabel propertyTypeLabel = new GLabelBuilder(Types.LABEL_PROPERTY_TYPE)
            .id(UmlIDUtil.createPropertyLabelTypeId(toId(property)))
            .text(propertyType)
            .build();
         propertyBuilder.add(propertyTypeLabel);
      }

      // property multiplicity
      String propertyMultiplicity = UmlLabelUtil.getMultiplicity(property);
      if (!propertyMultiplicity.isBlank()) {
         GLabel propertyMultiplicityLabel = new GLabelBuilder(Types.LABEL_PROPERTY_MULTIPLICITY)
            .id(UmlIDUtil.createPropertyLabelMultiplicityId(toId(property)))
            .text(propertyMultiplicity)
            .build();
         propertyBuilder.add(new GLabelBuilder(Types.LABEL_TEXT).text("[").build());
         propertyBuilder.add(propertyMultiplicityLabel);
         propertyBuilder.add(new GLabelBuilder(Types.LABEL_TEXT).text("]").build());
      }

      return propertyBuilder.build();
   }

}
