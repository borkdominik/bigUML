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

import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.features.autocomplete.constants.AutocompleteConstants;
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
      var builder = new GCompartmentBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(options);

      builder
         .add(leftSide(source))
         .add(rightSide(source));

      applyIsStatic(source, builder);

      return builder.build();
   }

   protected GCompartment leftSide(final Property source) {
      var options = new GLayoutOptions()
         .hGap(3)
         .paddingTop(0.0)
         .paddingRight(0.0)
         .paddingBottom(0.0)
         .paddingLeft(0.0)
         .resizeContainer(true);
      var builder = new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(options)
         .add(visibilityBuilder(source).build());

      applyIsDerived(source, builder);

      builder.add(nameBuilder(source).build());

      return builder.build();
   }

   protected GCompartment rightSide(final Property source) {
      var options = new GLayoutOptions()
         .hGap(3)
         .paddingTop(0.0)
         .paddingRight(0.0)
         .paddingBottom(0.0)
         .paddingLeft(0.0)
         .resizeContainer(true);
      var builder = new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(options);

      var detailsBuilder = new GCompartmentBuilder(DefaultTypes.COMPARTMENT)
         .id(idCountGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new GLayoutOptions()
            .hGap(3)
            .paddingTop(0.0)
            .paddingRight(0.0)
            .paddingBottom(0.0)
            .paddingLeft(0.0));

      var applied = List.of(applyType(source, detailsBuilder), applyMultiplicity(source, detailsBuilder));

      if (applied.stream().anyMatch(a -> a)) {
         builder
            .add(separatorBuilder(source, ":").build())
            .add(detailsBuilder.build());
      }

      return builder.build();
   }

   protected GLabel buildTypeName(final Property source, final String text) {
      return new GLabelBuilder(configuration(PropertyConfiguration.class).typeTypeId())
         .id(suffix.appendTo(PropertyTypeLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)))
         .text(text)
         .addArgument(AutocompleteConstants.GMODEL_FEATURE, true)
         .build();
   }

   protected boolean applyType(final Property source, final GCompartmentBuilder builder) {
      return Optional.ofNullable(source.getType()).map(type -> {
         var name = type.getName() == null || type.getName().isBlank()
            ? type.getClass().getSimpleName().replace("Impl", "")
            : type.getName();
         builder.add(buildTypeName(source, name));
         return true;
      }).orElse(false);
   }

   protected boolean applyMultiplicity(final Property source,
      final GCompartmentBuilder builder) {
      var multiplicity = MultiplicityUtil.getMultiplicity(source);

      if (!multiplicity.equals("1")) {
         builder
            .add(separatorBuilder(source, "[").build())
            .add(new GLabelBuilder(configuration(PropertyConfiguration.class).multiplicityTypeId())
               .id(suffix.appendTo(PropertyMultiplicityLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)))
               .text(multiplicity)
               .build())
            .add(separatorBuilder(source, "]").build());
         return true;
      }

      return false;
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
