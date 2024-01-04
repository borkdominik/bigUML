/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.named_element;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBaseObject;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBuildable;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBuildableProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.components.header.GCHeader;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCLabel;
import com.eclipsesource.uml.glsp.sdk.ui.components.label.GCNameLabel;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;

public class GCNamedElement<TSource extends EObject & NamedElement> extends GCBaseObject<TSource>
   implements GCBuildableProvider<GModelElement> {

   protected final Options options;

   public GCNamedElement(final GModelContext context, final TSource source, final Options options) {
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
            new UmlGCompartmentBuilder<>(origin, context)
               .withHBoxLayout()
               .build());
      }

      var headerOptions = new GCHeader.Options();
      headerOptions.fullHeight = !options.inline && options.container.getAssignableChildrenSize() == 1;
      return new GCHeader(context, origin, headerOptions);
   }

   protected List<GCProvider> createPrefix() {
      return options.prefix
         .stream()
         .map(p -> {
            var labelOptions = new GCLabel.Options(p);

            labelOptions.css.addAll(options.prefixCss);
            return new GCLabel(context, origin, labelOptions);
         })
         .collect(Collectors.toList());
   }

   protected GCProvider createVisibility() {
      var options = new GCLabel.Options(VisibilityKindUtils.asSingleLabel(origin.getVisibility()));

      return new GCLabel(context, origin, options);
   }

   protected GCProvider createName() {
      var options = new GCNameLabel.Options(name());
      if (this.options.nameCssReplace) {
         options.css.clear();
      }
      options.css.addAll(this.options.nameCss);
      return new GCNameLabel(context, origin, options);
   }

   public static class Options {
      public List<String> nameCss = new ArrayList<>();
      public boolean nameCssReplace = false;
      public List<String> prefixCss = new ArrayList<>();
      public List<String> prefix = new ArrayList<>();
      public Optional<String> name = Optional.empty();

      public boolean showVisibility = false;
      public boolean inline = false;

      public final GCModelList<?, ?> container;

      public Options(final GCModelList<?, ?> container) {
         super();
         this.container = container;
      }

   }
}
