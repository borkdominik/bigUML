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

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGModelMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.google.inject.Inject;

public final class PropertyCompartmentMapper extends BaseGModelMapper<Property, GCompartment>
   implements NamedElementGBuilder<Property> {
   @Inject
   protected IdCountContextGenerator idCountGenerator;

   @Override
   public GCompartment map(final Property source) {
      var builder = new GCompartmentBuilder(UmlClass_Property.TYPE_ID)
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .resizeContainer(true))
         .add(iconFromCssPropertyBuilder(source, "--uml-property-icon").build())
         .add(visibilityBuilder(source).build());

      applyIsDerived(source, builder);

      builder
         .add(nameBuilder(source).build())
         .add(separatorBuilder(source, ":").build());

      applyType(source, builder);
      applyMultiplicity(source, builder);
      applyIsStatic(source, builder);

      return builder.build();
   }

   protected GLabel buildTypeName(final Property source, final String text) {
      return new GLabelBuilder(UmlClass_Property.LABEL_TYPE)
         .id(suffix.appendTo(PropertyTypeLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)))
         .text(text)
         .build();
   }

   protected void applyType(final Property source, final GCompartmentBuilder builder) {
      Optional.ofNullable(source.getType()).ifPresentOrElse(type -> {
         var name = type.getName() == null || type.getName().isBlank()
            ? type.getClass().getSimpleName().replace("Impl", "")
            : type.getName();
         builder.add(buildTypeName(source, name));
      }, () -> builder.add(buildTypeName(source, "<Undefined>")));
   }

   protected void applyMultiplicity(final Property source,
      final GCompartmentBuilder builder) {
      var multiplicity = MultiplicityUtil.getMultiplicity(source);

      builder
         .add(separatorBuilder(source, "[").build())
         .add(new GLabelBuilder(UmlClass_Property.LABEL_MULTIPLICITY)
            .id(suffix.appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)))
            .text(multiplicity)
            .build())
         .add(separatorBuilder(source, "]").build());
   }

   protected void applyIsDerived(final Property source, final GCompartmentBuilder builder) {
      if (source.isDerived()) {
         builder.add(textBuilder(source, "/").build());
      }
   }

   protected void applyIsStatic(final Property source, final GCompartmentBuilder builder) {
      if (source.isStatic()) {
         builder.addCssClass(CoreCSS.TEXT_UNDERLINE);
      }
   }
}
