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

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.UmlConfig;
import com.eclipsesource.uml.glsp.old.utils.property.PropertyUtil;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.ClassSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.google.inject.Inject;

public class PropertyCompartmentMapper extends BaseGModelMapper<Property, GCompartment> {
   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   private Suffix suffix;

   @Inject
   private ClassSuffix classSuffix;

   @Inject
   private UmlModelState modelState;

   @Inject
   private GModelMapHandler mapHandler;

   @Override
   public GCompartment map(final Property property) {
      GCompartmentBuilder propertyBuilder = new GCompartmentBuilder(ClassTypes.PROPERTY)
         .layout(GConstants.Layout.HBOX)
         .id(idGenerator.getOrCreateId(property));

      // property icon
      GCompartment propertyIcon = new GCompartmentBuilder(ClassTypes.ICON_PROPERTY)
         .id(classSuffix.propertyIconSuffix.appendTo(idGenerator.getOrCreateId(property))).build();
      propertyBuilder.add(propertyIcon);

      GLayoutOptions layoutOptions = new GLayoutOptions()
         .hGap(3)
         .resizeContainer(true);
      propertyBuilder.layoutOptions(layoutOptions);

      // property name
      GLabel propertyNameLabel = new GLabelBuilder(ClassTypes.LABEL_PROPERTY_NAME)
         .id(classSuffix.propertyLabelNameSuffix.appendTo(idGenerator.getOrCreateId(property)))
         .text(property.getName())
         .build();
      propertyBuilder.add(propertyNameLabel);

      // separator
      GLabel separatorLabel = new GLabelBuilder(UmlConfig.Types.LABEL_TEXT)
         .text(":")
         .build();
      propertyBuilder.add(separatorLabel);

      // property type
      String propertyType = PropertyUtil.getTypeName(property);
      if (!propertyType.isBlank()) {
         GLabel propertyTypeLabel = new GLabelBuilder(ClassTypes.LABEL_PROPERTY_TYPE)
            .id(classSuffix.propertyLabelTypeSuffix.appendTo(idGenerator.getOrCreateId(property)))
            .text(propertyType)
            .build();
         propertyBuilder.add(propertyTypeLabel);
      }

      // property multiplicity
      String propertyMultiplicity = PropertyUtil.getMultiplicity(property);
      if (!propertyMultiplicity.isBlank()) {
         GLabel propertyMultiplicityLabel = new GLabelBuilder(ClassTypes.LABEL_PROPERTY_MULTIPLICITY)
            .id(classSuffix.propertyLabelMultiplicitySuffix.appendTo(idGenerator.getOrCreateId(property)))
            .text(propertyMultiplicity)
            .build();
         propertyBuilder.add(new GLabelBuilder(UmlConfig.Types.LABEL_TEXT).text("[").build());
         propertyBuilder.add(propertyMultiplicityLabel);
         propertyBuilder.add(new GLabelBuilder(UmlConfig.Types.LABEL_TEXT).text("]").build());
      }

      return propertyBuilder.build();
   }
}
