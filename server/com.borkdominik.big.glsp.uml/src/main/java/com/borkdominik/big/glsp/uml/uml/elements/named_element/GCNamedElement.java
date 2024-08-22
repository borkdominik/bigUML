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

public class GCNamedElement<TSource extends EObject & NamedElement> extends GCBaseObject<TSource> implements GCBuildableProvider<GModelElement> {
   protected final Options options;

   public GCNamedElement(final GCModelContext context, final TSource source, final Options options) {
      super(context, source);
      this.options = options;
   }

   public String name() {
      return options.name.orElse(origin.getName());
   }

   @Override
   public boolean isVisible() {
      return true;
   }

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
         return new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context).withHBoxLayout().build());
      }
      var headerOptions = GCHeader.Options.builder().fullHeight(!options.inline && options.container.getAssignableChildrenSize() == 1).build();
      return new GCHeader(context, origin, headerOptions);
   }

   protected List<GCProvider> createPrefix() {
      return options.prefix.stream().map(p -> {
         var labelOptions = GCLabel.Options.builder().label(p).css(options.prefixCss).build();
         return new GCLabel(context, origin, labelOptions);
      }).collect(Collectors.toList());
   }

   protected GCProvider createVisibility() {
      var options = GCLabel.Options.builder().label(VisibilityKindUtils.asSingleLabel(origin.getVisibility())).build();
      return new GCLabel(context, origin, options);
   }

   protected GCProvider createName() {
      var options = GCNameLabel.Options.builder().label(name());
      if (this.options.nameCssReplace) {
         options.clearCss();
      }
      options.css(this.options.nameCss);
      return new GCNameLabel(context, origin, options.build());
   }

   public static class Options {
      public List<String> nameCss;
      public boolean nameCssReplace;
      public List<String> prefixCss;
      public List<String> prefix;
      public Optional<String> name;
      public boolean showVisibility;
      public boolean inline;
      public final GCModelList<?, ?> container;

      private static boolean $default$nameCssReplace() {
         return false;
      }

      private static Optional<String> $default$name() {
         return Optional.empty();
      }

      private static boolean $default$showVisibility() {
         return false;
      }

      private static boolean $default$inline() {
         return false;
      }

      Options(final List<String> nameCss, final boolean nameCssReplace, final List<String> prefixCss, final List<String> prefix, final Optional<String> name, final boolean showVisibility, final boolean inline, final GCModelList<?, ?> container) {
         this.nameCss = nameCss;
         this.nameCssReplace = nameCssReplace;
         this.prefixCss = prefixCss;
         this.prefix = prefix;
         this.name = name;
         this.showVisibility = showVisibility;
         this.inline = inline;
         this.container = container;
      }

      public static class OptionsBuilder {
         private java.util.ArrayList<String> nameCss;
         private boolean nameCssReplace$set;
         private boolean nameCssReplace$value;
         private java.util.ArrayList<String> prefixCss;
         private java.util.ArrayList<String> prefix;
         private boolean name$set;
         private Optional<String> name$value;
         private boolean showVisibility$set;
         private boolean showVisibility$value;
         private boolean inline$set;
         private boolean inline$value;
         private GCModelList<?, ?> container;

         OptionsBuilder() {
         }

         public GCNamedElement.Options.OptionsBuilder nameCss(final String nameCss) {
            if (this.nameCss == null) this.nameCss = new java.util.ArrayList<String>();
            this.nameCss.add(nameCss);
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder nameCss(final java.util.Collection<? extends String> nameCss) {
            if (nameCss == null) {
               throw new java.lang.NullPointerException("nameCss cannot be null");
            }
            if (this.nameCss == null) this.nameCss = new java.util.ArrayList<String>();
            this.nameCss.addAll(nameCss);
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder clearNameCss() {
            if (this.nameCss != null) this.nameCss.clear();
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder nameCssReplace(final boolean nameCssReplace) {
            this.nameCssReplace$value = nameCssReplace;
            nameCssReplace$set = true;
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder prefixCss(final String prefixCss) {
            if (this.prefixCss == null) this.prefixCss = new java.util.ArrayList<String>();
            this.prefixCss.add(prefixCss);
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder prefixCss(final java.util.Collection<? extends String> prefixCss) {
            if (prefixCss == null) {
               throw new java.lang.NullPointerException("prefixCss cannot be null");
            }
            if (this.prefixCss == null) this.prefixCss = new java.util.ArrayList<String>();
            this.prefixCss.addAll(prefixCss);
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder clearPrefixCss() {
            if (this.prefixCss != null) this.prefixCss.clear();
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder prefix(final String prefix) {
            if (this.prefix == null) this.prefix = new java.util.ArrayList<String>();
            this.prefix.add(prefix);
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder prefix(final java.util.Collection<? extends String> prefix) {
            if (prefix == null) {
               throw new java.lang.NullPointerException("prefix cannot be null");
            }
            if (this.prefix == null) this.prefix = new java.util.ArrayList<String>();
            this.prefix.addAll(prefix);
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder clearPrefix() {
            if (this.prefix != null) this.prefix.clear();
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder name(final Optional<String> name) {
            this.name$value = name;
            name$set = true;
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder showVisibility(final boolean showVisibility) {
            this.showVisibility$value = showVisibility;
            showVisibility$set = true;
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder inline(final boolean inline) {
            this.inline$value = inline;
            inline$set = true;
            return this;
         }

         public GCNamedElement.Options.OptionsBuilder container(final GCModelList<?, ?> container) {
            this.container = container;
            return this;
         }

         public GCNamedElement.Options build() {
            java.util.List<String> nameCss;
            switch (this.nameCss == null ? 0 : this.nameCss.size()) {
            case 0: 
               nameCss = java.util.Collections.emptyList();
               break;
            case 1: 
               nameCss = java.util.Collections.singletonList(this.nameCss.get(0));
               break;
            default: 
               nameCss = java.util.Collections.unmodifiableList(new java.util.ArrayList<String>(this.nameCss));
            }
            java.util.List<String> prefixCss;
            switch (this.prefixCss == null ? 0 : this.prefixCss.size()) {
            case 0: 
               prefixCss = java.util.Collections.emptyList();
               break;
            case 1: 
               prefixCss = java.util.Collections.singletonList(this.prefixCss.get(0));
               break;
            default: 
               prefixCss = java.util.Collections.unmodifiableList(new java.util.ArrayList<String>(this.prefixCss));
            }
            java.util.List<String> prefix;
            switch (this.prefix == null ? 0 : this.prefix.size()) {
            case 0: 
               prefix = java.util.Collections.emptyList();
               break;
            case 1: 
               prefix = java.util.Collections.singletonList(this.prefix.get(0));
               break;
            default: 
               prefix = java.util.Collections.unmodifiableList(new java.util.ArrayList<String>(this.prefix));
            }
            boolean nameCssReplace$value = this.nameCssReplace$value;
            if (!this.nameCssReplace$set) nameCssReplace$value = Options.$default$nameCssReplace();
            Optional<String> name$value = this.name$value;
            if (!this.name$set) name$value = Options.$default$name();
            boolean showVisibility$value = this.showVisibility$value;
            if (!this.showVisibility$set) showVisibility$value = Options.$default$showVisibility();
            boolean inline$value = this.inline$value;
            if (!this.inline$set) inline$value = Options.$default$inline();
            return new GCNamedElement.Options(nameCss, nameCssReplace$value, prefixCss, prefix, name$value, showVisibility$value, inline$value, this.container);
         }

         @Override
         public java.lang.String toString() {
            return "GCNamedElement.Options.OptionsBuilder(nameCss=" + this.nameCss + ", nameCssReplace$value=" + this.nameCssReplace$value + ", prefixCss=" + this.prefixCss + ", prefix=" + this.prefix + ", name$value=" + this.name$value + ", showVisibility$value=" + this.showVisibility$value + ", inline$value=" + this.inline$value + ", container=" + this.container + ")";
         }
      }

      public static GCNamedElement.Options.OptionsBuilder builder() {
         return new GCNamedElement.Options.OptionsBuilder();
      }
   }
}
