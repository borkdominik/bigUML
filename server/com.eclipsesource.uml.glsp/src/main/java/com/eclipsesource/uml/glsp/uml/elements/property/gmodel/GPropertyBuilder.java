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
package com.eclipsesource.uml.glsp.uml.elements.property.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.features.autocomplete.constants.AutocompleteConstants;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCModelBuilder;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCLabel;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GModelProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GNotationProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GSelectionBorderProperty;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GCNamedElement;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.property.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;
import com.eclipsesource.uml.glsp.uml.utils.MultiplicityUtil;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;

public class GPropertyBuilder<TOrigin extends Property>
   extends GCModelBuilder<TOrigin, GNode> {
   protected final String type;

   public GPropertyBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin);

      this.type = type;
   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator().getOrCreateId(origin))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new UmlGLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(CoreCSS.NODE)
         .build();
   }

   @Override
   protected List<GModelProperty> getRootGModelProperties() { return List.of(new GSelectionBorderProperty()); }

   @Override
   protected List<GNotationProperty> getRootGNotationProperties() { return List.of(); }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GNode modelRoot) {
      var root = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      root.addAll(List.of(leftSide(root), rightSide(root)));

      return root;
   }

   protected GCProvider leftSide(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      container.add(
         new GCLabel(context, origin,
            new GCLabel.Options(VisibilityKindUtils.asSingleLabel(origin.getVisibility()))));

      if (origin.isDerived()) {
         container.add(new GCLabel(context, origin,
            new GCLabel.Options("/")));
      }

      var options = new GCNamedElement.Options(root);
      options.inline = true;
      options.nameCssReplace = true;
      options.nameCss.add(CoreCSS.TEXT_HIGHLIGHT);

      if (origin.isStatic()) {
         options.nameCss.add(CoreCSS.TEXT_UNDERLINE);
      }

      container.add(new GCNamedElement<>(context, origin, options));

      return container;
   }

   protected GCProvider rightSide(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .addLayoutOptions(new GLayoutOptions().hGap(3))
         .build());

      var applied = new ArrayList<GCProvider>();
      applied.add(buildType());
      applied.add(buildMultiplicity());

      if (applied.stream().anyMatch(a -> a != null)) {
         var details = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
            .withHBoxLayout()
            .addLayoutOptions(new GLayoutOptions().hGap(3))
            .build());

         applied.forEach(a -> {
            if (a != null) {
               details.add(a);
            }
         });

         container.add(new UmlGLabelBuilder<>(origin, context).text(":").build());
         container.add(details);
      }

      return container;
   }

   protected GCProvider buildType() {
      return Optional.ofNullable(origin.getType()).map(type -> {
         var name = type.getName() == null || type.getName().isBlank()
            ? type.getClass().getSimpleName().replace("Impl", "")
            : type.getName();
         return buildTypeName(name);
      }).orElse(null);
   }

   protected GCProvider buildTypeName(final String text) {
      var options = new GCLabel.Options(text);
      options.id = Optional.of(context.suffix().appendTo(PropertyTypeLabelSuffix.SUFFIX,
         context.idGenerator().getOrCreateId(origin)));

      options.type = context.configurationFor(context.representation(), Property.class, PropertyConfiguration.class)
         .typeTypeId();
      options.css.add(CoreCSS.TEXT_INTERACTABLE);
      options.arguments.put(AutocompleteConstants.GMODEL_FEATURE, true);

      return new GCLabel(context, origin, options);
   }

   protected GCProvider buildMultiplicity() {
      var multiplicity = MultiplicityUtil.getMultiplicity(origin);

      if (!multiplicity.equals("1")) {
         var container = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
            .withHBoxLayout()
            .addLayoutOptions(new GLayoutOptions().hGap(3))
            .build());

         container.addAllGModels(List.of(
            new UmlGLabelBuilder<>(origin, context).text("[").build(),
            new UmlGLabelBuilder<>(origin, context,
               context.configurationFor(context.representation(), Property.class, PropertyConfiguration.class)
                  .multiplicityTypeId())
                     .id(context.suffix().appendTo(PropertyMultiplicityLabelSuffix.SUFFIX,
                        context.idGenerator().getOrCreateId(origin)))
                     .text(multiplicity)
                     .addCssClass(CoreCSS.TEXT_INTERACTABLE)
                     .build(),
            new UmlGLabelBuilder<>(origin, context).text("]").build()));

         return container;
      }

      return null;
   }
}
