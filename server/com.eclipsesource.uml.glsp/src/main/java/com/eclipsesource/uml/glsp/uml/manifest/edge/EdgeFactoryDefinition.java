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
package com.eclipsesource.uml.glsp.uml.manifest.edge;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration.Edge;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateEdgeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.reconnect_edge.DiagramReconnectEdgeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramReconnectEdgeHandlerContribution;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.configuration.EdgeConfiguration;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationContribution;
import com.eclipsesource.uml.glsp.uml.configuration.di.EdgeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.configuration.di.EdgeConfigurationProvider;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperProvider;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperFactory;
import com.eclipsesource.uml.glsp.uml.gmodel.di.GModelMapperProvider;
import com.eclipsesource.uml.glsp.uml.handler.di.EdgeOperationHandlerFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.EdgeOperationHandlerProvider;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.assistedinject.FactoryModuleBuilder;
import com.google.inject.multibindings.Multibinder;

public abstract class EdgeFactoryDefinition extends EdgeDefinition
   implements ElementConfigurationContribution, DiagramReconnectEdgeHandlerContribution {
   protected final Class<?> factory;

   public EdgeFactoryDefinition(final String id, final Representation representation,
      final Class<?> factory) {
      super(id, representation);
      this.factory = factory;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeEdgeConfigurations(this::elementConfigurations);
      contributeDiagramReconnectEdgeHandlers(this::diagramReconnectEdgeHandlers);

      install(new FactoryModuleBuilder()
         .build(this.factory));

   }

   protected <TFactory> Optional<Class<TFactory>> supports(final Class<?> factory, final Class<TFactory> support) {
      if (support.isAssignableFrom(factory)) {
         return Optional.of((Class<TFactory>) factory);
      }
      return Optional.empty();
   }

   protected void elementConfigurations(final Multibinder<EdgeConfiguration<?>> contribution) {
      supports(factory, EdgeConfigurationFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new EdgeConfigurationProvider(representation(), f)));
   }

   @Override
   protected void diagramConfigurations(final Multibinder<Edge> contribution) {
      supports(factory, EdgeConfigurationFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new EdgeConfigurationProvider(representation(), f)));
   }

   @Override
   protected void diagramCreateHandlers(final Multibinder<DiagramCreateEdgeHandler> contribution) {
      supports(factory, EdgeOperationHandlerFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new EdgeOperationHandlerProvider(representation(), f)));
   }

   @Override
   protected void diagramDeleteHandlers(final Multibinder<DiagramDeleteHandler<? extends EObject>> contribution) {
      supports(factory, EdgeOperationHandlerFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new EdgeOperationHandlerProvider(representation(), f)));
   }

   @Override
   protected void diagramUpdateHandlers(final Multibinder<DiagramUpdateHandler<? extends EObject>> contribution) {
      supports(factory, EdgeOperationHandlerFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new EdgeOperationHandlerProvider(representation(), f)));
   }

   protected void diagramReconnectEdgeHandlers(
      final Multibinder<DiagramReconnectEdgeHandler<? extends EObject>> contribution) {
      supports(factory, EdgeOperationHandlerFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new EdgeOperationHandlerProvider(representation(), f)));
   }

   @Override
   protected void gmodelMappers(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> contribution) {
      supports(factory, GModelMapperFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new GModelMapperProvider(representation(), f)));
   }

   @Override
   protected void diagramLabelEditMappers(final Multibinder<DiagramLabelEditMapper<? extends EObject>> contribution) {
      supports(factory, LabelEditMapperFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new LabelEditMapperProvider(representation(), f)));
   }

   @Override
   protected void diagramPropertyPaletteMappers(
      final Multibinder<DiagramElementPropertyMapper<? extends EObject>> contribution) {
      supports(factory, PropertyMapperFactory.class)
         .ifPresent(f -> contribution.addBinding().toProvider(new PropertyMapperProvider(representation(), f)));
   }
}
