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
package com.eclipsesource.uml.glsp.uml.elements.operation.gmodel;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCModelBuilder;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GModelProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GNotationProperty;
import com.eclipsesource.uml.glsp.sdk.ui.properties.GSelectionBorderProperty;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GCNamedElement;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLabelBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;

public class GOperationBuilder<TOrigin extends Operation>
   extends GCModelBuilder<TOrigin, GNode> {
   protected final String type;

   public GOperationBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin);

      this.type = type;
   }

   public List<Parameter> inputParameters() {
      return origin.getOwnedParameters().stream()
         .filter(p -> p.getDirection() != ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());
   }

   public List<Parameter> returnParameters() {
      return origin.getOwnedParameters().stream()
         .filter(p -> p.getDirection() == ParameterDirectionKind.RETURN_LITERAL).collect(Collectors.toList());
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

      root.addAll(List.of(createName(root), createInputParameters(root), createReturnParameters(root)));

      return root;
   }

   protected GCProvider createName(final GCModelList<?, ?> root) {
      var options = new GCNamedElement.Options(root);
      options.inline = true;
      options.showVisibility = true;
      options.nameCssReplace = true;
      options.nameCss.add(CoreCSS.TEXT_HIGHLIGHT);

      if (origin.isStatic()) {
         options.nameCss.add(CoreCSS.TEXT_UNDERLINE);
      }
      if (origin.isAbstract()) {
         options.nameCss.add(CoreCSS.FONT_ITALIC);
      }

      return new GCNamedElement<>(context, origin, options);
   }

   protected GCProvider createInputParameters(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      container.add(new UmlGLabelBuilder<>(origin, context).text("(").build());

      var parameters = inputParameters();
      for (int i = 0; i < parameters.size(); i++) {
         if (i > 0) {
            container.add(new UmlGLabelBuilder<>(origin, context).text(",").build());
         }

         container.add(context.gmodelMapHandler().handle(parameters.get(i)));
      }

      container.add(new UmlGLabelBuilder<>(origin, context).text(")").build());

      return container;
   }

   protected GCProvider createReturnParameters(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new UmlGCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      var parameters = returnParameters();

      if (parameters.size() > 0) {
         container.add(new UmlGLabelBuilder<>(origin, context).text(":").build());

         for (int i = 0; i < parameters.size(); i++) {
            if (i > 0) {
               container.add(new UmlGLabelBuilder<>(origin, context).text(",").build());
            }

            container.add(context.gmodelMapHandler().handle(parameters.get(i)));
         }
      }

      return container;
   }
}
