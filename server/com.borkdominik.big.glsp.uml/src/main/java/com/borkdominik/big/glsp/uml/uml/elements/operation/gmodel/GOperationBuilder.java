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
package com.borkdominik.big.glsp.uml.uml.elements.operation.gmodel;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.ParameterDirectionKind;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;
import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLabelBuilder;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCLayoutOptions;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCModelBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GModelProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GNotationProperty;
import com.borkdominik.big.glsp.server.sdk.ui.properties.GSelectionBorderProperty;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public class GOperationBuilder<TOrigin extends Operation>
   extends GCModelBuilder<TOrigin, GNode> {
   protected final String type;

   public GOperationBuilder(final GCModelContext context, final TOrigin origin, final String type) {
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

      root.addAll(List.of(createName(root), createInputParameters(root), createReturnParameters(root)));

      return root;
   }

   protected GCProvider createName(final GCModelList<?, ?> root) {
      var options = GCNamedElement.Options.builder()
         .container(root)
         .inline(true)
         .showVisibility(true)
         .nameCssReplace(true)
         .nameCss(BGCoreCSS.TEXT_HIGHLIGHT);

      if (origin.isStatic()) {
         options.nameCss(BGCoreCSS.TEXT_UNDERLINE);
      }
      if (origin.isAbstract()) {
         options.nameCss(BGCoreCSS.FONT_ITALIC);
      }

      return new GCNamedElement<>(context, origin, options.build());
   }

   protected GCProvider createInputParameters(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      container.add(new BCLabelBuilder(origin, context).text("(").build());

      var parameters = inputParameters();
      for (int i = 0; i < parameters.size(); i++) {
         if (i > 0) {
            container.add(new BCLabelBuilder(origin, context).text(",").build());
         }

         container.add(context.mapHandler.handle(parameters.get(i)));
      }

      container.add(new BCLabelBuilder(origin, context).text(")").build());

      return container;
   }

   protected GCProvider createReturnParameters(final GCModelList<?, ?> root) {
      var container = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withHBoxLayout()
         .build());

      var parameters = returnParameters();

      if (parameters.size() > 0) {
         container.add(new BCLabelBuilder(origin, context).text(":").build());

         for (int i = 0; i < parameters.size(); i++) {
            if (i > 0) {
               container.add(new BCLabelBuilder(origin, context).text(",").build());
            }

            container.add(context.mapHandler.handle(parameters.get(i)));
         }
      }

      return container;
   }
}
