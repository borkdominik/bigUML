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
package com.eclipsesource.uml.glsp.sdk.ui.components.label;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdgePlacement;
import org.eclipse.glsp.graph.GLabel;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCIdentifiable;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelElement;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;

public class GCLabel extends GCModelElement<EObject, GLabel> implements GCIdentifiable {
   public static final String CSS_ID = "gc-label";
   protected GLabel rootGModel;

   protected Options options;

   public GCLabel(final GModelContext context, final EObject source, final Options options) {
      super(context, source);

      this.options = options;
   }

   @Override
   public String getIdentifier() { return CSS_ID; }

   public Options getOptions() { return options; }

   @Override
   protected Optional<GLabel> createRootGModel() {
      var labelBuilder = new UmlGLabelBuilder<>(origin, context, options.type)
         .addCssClasses(options.css)
         .edgePlacement(options.edgePlacement)
         .text(options.label);

      options.id.ifPresent(id -> labelBuilder.id(id));

      return Optional.of(labelBuilder.build());
   }

   public static class Options {
      public String label;
      public Optional<String> id = Optional.empty();
      public String type = CoreTypes.LABEL_TEXT;
      public List<String> css = new ArrayList<>();
      public Map<String, Object> arguments = new HashMap<>();

      public GEdgePlacement edgePlacement;

      public Options(final String label) {
         super();
         this.label = label;
      }
   }

}
