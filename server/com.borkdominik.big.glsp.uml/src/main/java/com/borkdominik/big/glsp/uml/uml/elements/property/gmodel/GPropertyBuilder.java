/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.property.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Property;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.features.autocomplete.constants.BGAutocompleteConstants;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLabelBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLayoutOptions;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCModelBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.components.label.GCLabel;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GModelProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GNotationProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GSelectionBorderProperty;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.element.VisibilityKindUtils;
import com.borkdominik.big.glsp.uml.uml.elements.multiplicity_element.MultiplicityUtil;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;
import com.borkdominik.big.glsp.uml.uml.elements.property.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.borkdominik.big.glsp.uml.uml.elements.property.gmodel.suffix.PropertyTypeLabelSuffix;

public class GPropertyBuilder<TOrigin extends Property>
   extends GCModelBuilder<TOrigin, GNode> {
   protected final String type;

   public GPropertyBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin);

      this.type = type;
   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator.getOrCreateId(origin))
         .layout(GConstants.Layout.HBOX)
         .layoutOptions(new BCLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(BGCoreCSS.NODE)
         .build();
   }

   @Override
   protected List<GModelProperty> getRootGModelProperties() { return List.of(new GSelectionBorderProperty()); }

   @Override
   protected List<GNotationProperty> getRootGNotationProperties() { return List.of(); }

   @Override
   protected GCModelList<?, ?> createRootComponent(final GNode modelRoot) {
      var root = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      root.addAll(List.of(leftSide(root), rightSide(root)));

      return root;
   }

   protected GCProvider leftSide(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      container.add(
         new GCLabel(context, origin,
            GCLabel.Options.builder()
               .label(VisibilityKindUtils.asSingleLabel(origin.getVisibility()))
               .build()));

      if (origin.isDerived()) {
         container.add(new GCLabel(context, origin,
            GCLabel.Options.builder()
               .label("/")
               .build()));
      }

      var options = GCNamedElement.Options.builder()
         .container(root)
         .inline(true)
         .nameCssReplace(true)
         .nameCss(BGCoreCSS.TEXT_HIGHLIGHT);

      if (origin.isStatic()) {
         options.nameCss(BGCoreCSS.TEXT_UNDERLINE);
      }

      container.add(new GCNamedElement<>(context, origin, options.build()));

      return container;
   }

   protected GCProvider rightSide(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .addLayoutOptions(new GLayoutOptions().hGap(3))
         .build());

      var applied = new ArrayList<GCProvider>();
      applied.add(buildType());
      applied.add(buildMultiplicity());

      if (applied.stream().anyMatch(a -> a != null)) {
         var details = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
            .withHBoxLayout()
            .addLayoutOptions(new GLayoutOptions().hGap(3))
            .build());

         applied.forEach(a -> {
            if (a != null) {
               details.add(a);
            }
         });

         container.add(new BCLabelBuilder(origin, context).text(":").build());
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
      var options = GCLabel.Options.builder()
         .label(text)
         .id(Optional
            .of(context.suffix.appendTo(PropertyTypeLabelSuffix.SUFFIX, context.idGenerator.getOrCreateId(origin))))
         .type(UMLTypes.PROPERTY_TYPE.prefix(context.representation()))
         .css(BGCoreCSS.TEXT_INTERACTABLE)
         .argument(BGAutocompleteConstants.GMODEL_FEATURE, true)
         .build();

      return new GCLabel(context, origin, options);
   }

   protected GCProvider buildMultiplicity() {
      var multiplicity = MultiplicityUtil.getMultiplicity(origin);

      if (!multiplicity.equals("1")) {
         var container = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
            .withHBoxLayout()
            .addLayoutOptions(new GLayoutOptions().hGap(3))
            .build());

         container.addAllGModels(List.of(
            new BCLabelBuilder(origin, context).text("[").build(),
            new BCLabelBuilder(origin, context, UMLTypes.PROPERTY_MULTIPLICITY.prefix(context.representation()))
               .id(context.suffix.appendTo(PropertyMultiplicityLabelSuffix.SUFFIX,
                  context.idGenerator.getOrCreateId(origin)))
               .text(multiplicity)
               .addCssClass(BGCoreCSS.TEXT_INTERACTABLE)
               .build(),
            new BCLabelBuilder(origin, context).text("]").build()));

         return container;
      }

      return null;
   }
}
