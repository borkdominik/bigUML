/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp;

import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.actions.DisposeClientSessionActionHandler;
import org.eclipse.glsp.server.actions.SaveModelActionHandler;
import org.eclipse.glsp.server.di.DefaultGLSPModule;
import org.eclipse.glsp.server.diagram.DiagramConfiguration;
import org.eclipse.glsp.server.features.core.model.ModelFactory;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperationHandler;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.features.undoredo.UndoRedoActionHandler;
import org.eclipse.glsp.server.layout.ILayoutEngine;
import org.eclipse.glsp.server.layout.ServerLayoutConfiguration;
import org.eclipse.glsp.server.model.ModelStateProvider;
import org.eclipse.glsp.server.operations.OperationActionHandler;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.operations.OperationHandlerRegistry;
import org.eclipse.glsp.server.operations.gmodel.ChangeBoundsOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.ChangeRoutingPointsHandler;
import org.eclipse.glsp.server.operations.gmodel.CompoundOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.DeleteOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.LayoutOperationHandler;
import org.eclipse.glsp.server.protocol.GLSPServer;
import org.eclipse.glsp.server.utils.MultiBinding;

import com.eclipsesource.uml.glsp.actions.ReturnTypesAction;
import com.eclipsesource.uml.glsp.actions.UmlDisposeClientSessionActionHandler;
import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.actions.UmlSaveModelActionHandler;
import com.eclipsesource.uml.glsp.actions.UmlUndoRedoActionHandler;
import com.eclipsesource.uml.glsp.diagram.UmlDiagramConfiguration;
import com.eclipsesource.uml.glsp.layout.UmlLayoutEngine;
import com.eclipsesource.uml.glsp.layout.UmlServerLayoutConfiguration;
import com.eclipsesource.uml.glsp.model.UmlModelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelStateProvider;
import com.eclipsesource.uml.glsp.modelserver.ModelServerClientProvider;
import com.eclipsesource.uml.glsp.operations.CreateClassifierChildNodeOperationHandler;
import com.eclipsesource.uml.glsp.operations.CreateClassifierNodeOperationHandler;
import com.eclipsesource.uml.glsp.operations.CreateEdgeOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlChangeBoundsOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlChangeRoutingPointsOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlDeleteOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlOperationActionHandler;
import com.eclipsesource.uml.glsp.palette.UmlToolPaletteItemProvider;

public class UmlGLSPModule extends DefaultGLSPModule {

   @Override
   protected void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      super.configureActionHandlers(bindings);
      bindings.add(UmlGetTypesActionHandler.class);
      bindings.rebind(SaveModelActionHandler.class, UmlSaveModelActionHandler.class);
      bindings.rebind(OperationActionHandler.class, UmlOperationActionHandler.class);
      bindings.rebind(UndoRedoActionHandler.class, UmlUndoRedoActionHandler.class);
      bindings.rebind(DisposeClientSessionActionHandler.class, UmlDisposeClientSessionActionHandler.class);
   }

   @Override
   protected Class<? extends OperationHandlerRegistry> bindOperationHandlerRegistry() {
      return UmlDIOperationHandlerRegistry.class;
   }

   @Override
   public Class<? extends ModelFactory> bindModelFactory() {
      return UmlModelFactory.class;
   }

   @Override
   protected Class<? extends ILayoutEngine> bindLayoutEngine() {
      return UmlLayoutEngine.class;
   }

   @Override
   protected Class<? extends ToolPaletteItemProvider> bindToolPaletteItemProvider() {
      return UmlToolPaletteItemProvider.class;
   }

   @Override
   protected void configureClientActions(final MultiBinding<Action> bindings) {
      super.configureClientActions(bindings);
      bindings.add(ReturnTypesAction.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      super.configureOperationHandlers(bindings);
      bindings.add(CompoundOperationHandler.class);
      bindings.rebind(ApplyLabelEditOperationHandler.class, UmlLabelEditOperationHandler.class);
      bindings.rebind(ChangeBoundsOperationHandler.class, UmlChangeBoundsOperationHandler.class);
      bindings.rebind(ChangeRoutingPointsHandler.class, UmlChangeRoutingPointsOperationHandler.class);
      bindings.rebind(DeleteOperationHandler.class, UmlDeleteOperationHandler.class);
      bindings.add(CreateClassifierNodeOperationHandler.class);
      bindings.add(CreateEdgeOperationHandler.class);
      bindings.add(CreateClassifierChildNodeOperationHandler.class);
      bindings.add(LayoutOperationHandler.class);
   }

   @Override
   protected Class<? extends ServerLayoutConfiguration> bindServerLayoutConfiguration() {
      return UmlServerLayoutConfiguration.class;
   }

   @Override
   protected Class<? extends ModelStateProvider> bindModelStateProvider() {
      return UmlModelStateProvider.class;
   }

   @Override
   protected void configureDiagramConfigurations(final MultiBinding<DiagramConfiguration> bindings) {
      bindings.add(UmlDiagramConfiguration.class);
   }

   @SuppressWarnings("rawtypes")
   @Override
   protected Class<? extends GLSPServer> bindGLSPServer() {
      return UmlGLSPServer.class;
   }

   @Override
   public void configure() {
      super.configure();
      bind(ModelServerClientProvider.class).asEagerSingleton();
   }

}
