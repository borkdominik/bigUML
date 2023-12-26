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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.components.label;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.element.GCModelElement;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;

public class GCLabel extends GCModelElement {
   public static final String CSS_ID = "gc-label";
   protected GLabel rootGModel;

   protected String label;
   protected Optional<String> id;
   protected List<String> css;

   public GCLabel(final GModelContext context, final EObject source, final Options options) {
      super(context, source);

      this.label = options.label;
      this.id = options.id;
      this.css = options.css;
   }

   @Override
   protected Optional<String> getCssIdentifier() { return Optional.of(CSS_ID); }

   public String getLabel() { return label; }

   public void setLabel(final String label) { this.label = label; }

   public Optional<String> getId() { return id; }

   public void setId(final Optional<String> id) { this.id = id; }

   public List<String> getCss() { return css; }

   public void setCss(final List<String> css) { this.css = css; }

   @Override
   public GModelElement buildGModel() {
      setRootGModel(createRootGModel());
      return super.buildGModel();
   }

   protected GLabel createRootGModel() {
      var labelBuilder = new UmlGLabelBuilder<>(source, context, CoreTypes.LABEL_TEXT)
         .addCssClasses(css)
         .text(label);

      id.ifPresent(id -> labelBuilder.id(id));

      return labelBuilder.build();
   }

   public static class Options {
      public String label;
      public Optional<String> id = Optional.empty();
      public List<String> css = new ArrayList<>();

      public Options(final String label) {
         super();
         this.label = label;
      }
   }

}
