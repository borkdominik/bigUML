/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.named_element;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.NamedElement;

import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCBaseObject;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCBuildable;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCBuildableProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.components.header.GCHeader;
import com.borkdominik.big.glsp.server.sdk.ui.components.label.GCLabel;
import com.borkdominik.big.glsp.server.sdk.ui.components.label.GCNameLabel;
import com.borkdominik.big.glsp.uml.uml.elements.element.VisibilityKindUtils;

import lombok.Builder;
import lombok.Singular;

public class GCNamedElement<TSource extends EObject & NamedElement> extends GCBaseObject<TSource>
   implements GCBuildableProvider<GModelElement> {

   protected final Options options;

   public GCNamedElement(final GCModelContext context, final TSource source, final Options options) {
      super(context, source);

      this.options = options;
   }

   public String name() {
      return options.name.orElse(origin.getName());
   }

   @Override
   public boolean isVisible() { return true; }

   @Override
   public GCBuildable<GModelElement> provide() {
      var container = createContainer();
      container.addAll(createPrefix());
      if (this.options.showVisibility) {
         container.add(createVisibility());
      }
      container.add(createName());

      return container;
   }

   protected GCModelList<?, GModelElement> createContainer() {
      if (options.inline) {
         return new GCModelList<>(context, origin,
            new BCCompartmentBuilder<>(origin, context)
               .withHBoxLayout()
               .build());
      }

      var headerOptions = GCHeader.Options.builder()
         .fullHeight(!options.inline && options.container.getAssignableChildrenSize() == 1)
         .build();
      return new GCHeader(context, origin, headerOptions);
   }

   protected List<GCProvider> createPrefix() {
      return options.prefix
         .stream()
         .map(p -> {
            var labelOptions = GCLabel.Options.builder()
               .label(p)
               .css(options.prefixCss)
               .build();
            return new GCLabel(context, origin, labelOptions);
         })
         .collect(Collectors.toList());
   }

   protected GCProvider createVisibility() {
      var options = GCLabel.Options.builder()
         .label(VisibilityKindUtils.asSingleLabel(origin.getVisibility()))
         .build();

      return new GCLabel(context, origin, options);
   }

   protected GCProvider createName() {
      var options = GCNameLabel.Options.builder()
         .label(name());

      if (this.options.nameCssReplace) {
         options.clearCss();
      }

      options.css(this.options.nameCss);

      return new GCNameLabel(context, origin, options.build());
   }

   @Builder
   public static class Options {
      @Singular(value = "nameCss")
      public List<String> nameCss;

      @Builder.Default
      public boolean nameCssReplace = false;

      @Singular(value = "prefixCss")
      public List<String> prefixCss;

      @Singular(value = "prefix")
      public List<String> prefix;

      @Builder.Default
      public Optional<String> name = Optional.empty();
      @Builder.Default
      public boolean showVisibility = false;
      @Builder.Default
      public boolean inline = false;

      public final GCModelList<?, ?> container;

   }
}
