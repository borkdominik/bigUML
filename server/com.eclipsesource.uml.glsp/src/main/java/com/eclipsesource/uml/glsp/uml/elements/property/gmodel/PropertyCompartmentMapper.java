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
package com.eclipsesource.uml.glsp.uml.elements.property.gmodel;

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
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGModelMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class PropertyCompartmentMapper extends RepresentationGModelMapper<Property, GCompartment>
   implements NamedElementGBuilder<Property> {

   @Inject
   public PropertyCompartmentMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Inject
   protected IdCountContextGenerator idCountGenerator;

   @Override
   public GCompartment map(final Property source) {
      var options = new GLayoutOptions()
         .resizeContainer(true);
      options.put("hGrab", true);
      var builder = new GCompartmentBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(options)
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
      return new GLabelBuilder(configuration(PropertyConfiguration.class).typeTypeId())
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
         .add(new GLabelBuilder(configuration(PropertyConfiguration.class).multiplicityTypeId())
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
