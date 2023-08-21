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
package com.eclipsesource.uml.glsp.uml.manifest.node;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration.Node;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationContribution;
import com.eclipsesource.uml.glsp.uml.configuration.NodeConfiguration;
import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationProvider;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperProvider;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperProvider;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerProvider;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.assistedinject.FactoryModuleBuilder;
import com.google.inject.multibindings.Multibinder;

public abstract class NodeFactoryDefinition extends NodeDefinition implements ElementConfigurationContribution {

   protected final Class<? extends NodeFactory> factory;

   public NodeFactoryDefinition(final String id, final Representation representation,
      final Class<? extends NodeFactory> factory) {
      super(id, representation);
      this.factory = factory;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeNodeConfigurations(this::elementConfigurations);

      install(new FactoryModuleBuilder()
         .build(this.factory));
   }

   protected void elementConfigurations(final Multibinder<NodeConfiguration<?>> contribution) {
      contribution.addBinding().toProvider(new NodeConfigurationProvider(representation(), factory));
   }

   @Override
   protected void diagramConfigurations(final Multibinder<Node> contribution) {
      contribution.addBinding().toProvider(new NodeConfigurationProvider(representation(), factory));
   }

   @Override
   protected void diagramCreateHandlers(final Multibinder<DiagramCreateNodeHandler> contribution) {
      contribution.addBinding().toProvider(new NodeOperationHandlerProvider(representation(), factory));
   }

   @Override
   protected void diagramDeleteHandlers(final Multibinder<DiagramDeleteHandler<? extends EObject>> contribution) {
      contribution.addBinding().toProvider(new NodeOperationHandlerProvider(representation(), factory));
   }

   @Override
   protected void diagramUpdateHandlers(final Multibinder<DiagramUpdateHandler<? extends EObject>> contribution) {
      contribution.addBinding().toProvider(new NodeOperationHandlerProvider(representation(), factory));
   }

   @Override
   protected void gmodelMappers(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> contribution) {
      contribution.addBinding().toProvider(new GModelMapperProvider(representation(), factory));
   }

   @Override
   protected void diagramLabelEditMappers(final Multibinder<DiagramLabelEditMapper<? extends EObject>> contribution) {
      contribution.addBinding().toProvider(new LabelEditMapperProvider(representation(), factory));
   }

   @Override
   protected void diagramPropertyPaletteMappers(
      final Multibinder<DiagramElementPropertyMapper<? extends EObject>> contribution) {
      contribution.addBinding().toProvider(new PropertyMapperProvider(representation(), factory));
   }
}
