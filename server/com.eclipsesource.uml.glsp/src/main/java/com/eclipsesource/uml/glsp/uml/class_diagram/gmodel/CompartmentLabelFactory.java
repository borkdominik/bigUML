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
package com.eclipsesource.uml.glsp.uml.class_diagram.gmodel;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.utils.property.PropertyIdUtil;
import com.eclipsesource.uml.glsp.uml.utils.property.PropertyUtil;
import com.eclipsesource.uml.glsp.utils.UmlConfig.Types;

public class CompartmentLabelFactory extends ClassAbstractGModelFactory<NamedElement, GCompartment> {

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
      GCompartmentBuilder propertyBuilder = new GCompartmentBuilder(ClassTypes.PROPERTY)
         .layout(GConstants.Layout.HBOX)
         .id(PropertyIdUtil.createPropertyId(toId(property)));

      // property icon
      GCompartment propertyIcon = new GCompartmentBuilder(ClassTypes.ICON_PROPERTY)
         .id(PropertyIdUtil.createPropertyIconId(toId(property))).build();
      propertyBuilder.add(propertyIcon);

      GLayoutOptions layoutOptions = new GLayoutOptions()
         .hGap(3)
         .resizeContainer(true);
      propertyBuilder.layoutOptions(layoutOptions);

      // property name
      GLabel propertyNameLabel = new GLabelBuilder(ClassTypes.LABEL_PROPERTY_NAME)
         .id(PropertyIdUtil.createPropertyLabelNameId(toId(property)))
         .text(property.getName())
         .build();
      propertyBuilder.add(propertyNameLabel);

      // separator
      GLabel separatorLabel = new GLabelBuilder(Types.LABEL_TEXT)
         .text(":")
         .build();
      propertyBuilder.add(separatorLabel);

      // property type
      String propertyType = PropertyUtil.getTypeName(property);
      if (!propertyType.isBlank()) {
         GLabel propertyTypeLabel = new GLabelBuilder(ClassTypes.LABEL_PROPERTY_TYPE)
            .id(PropertyIdUtil.createPropertyLabelTypeId(toId(property)))
            .text(propertyType)
            .build();
         propertyBuilder.add(propertyTypeLabel);
      }

      // property multiplicity
      String propertyMultiplicity = PropertyUtil.getMultiplicity(property);
      if (!propertyMultiplicity.isBlank()) {
         GLabel propertyMultiplicityLabel = new GLabelBuilder(ClassTypes.LABEL_PROPERTY_MULTIPLICITY)
            .id(PropertyIdUtil.createPropertyLabelMultiplicityId(toId(property)))
            .text(propertyMultiplicity)
            .build();
         propertyBuilder.add(new GLabelBuilder(Types.LABEL_TEXT).text("[").build());
         propertyBuilder.add(propertyMultiplicityLabel);
         propertyBuilder.add(new GLabelBuilder(Types.LABEL_TEXT).text("]").build());
      }

      return propertyBuilder.build();
   }

}
