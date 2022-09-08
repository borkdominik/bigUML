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

import org.eclipse.emfcloud.modelserver.glsp.EMSGLSPModule;
import org.eclipse.emfcloud.modelserver.glsp.model.EMSModelState;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.diagram.DiagramConfiguration;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.core.model.GModelFactory;
import org.eclipse.glsp.server.features.core.model.ModelSourceLoader;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperationHandler;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.layout.LayoutEngine;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.operations.OperationHandlerRegistry;
import org.eclipse.glsp.server.operations.gmodel.ChangeBoundsOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.ChangeRoutingPointsHandler;
import org.eclipse.glsp.server.operations.gmodel.CompoundOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.DeleteOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.LayoutOperationHandler;

import com.eclipsesource.uml.glsp.actions.ReturnTypesAction;
import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.contextmenu.UmlContextMenuItemProvider;
import com.eclipsesource.uml.glsp.diagram.UmlDiagramConfiguration;
import com.eclipsesource.uml.glsp.layout.UmlLayoutEngine;
import com.eclipsesource.uml.glsp.model.UmlModelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelSourceLoader;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.operations.UmlChangeBoundsOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlChangeRoutingPointsOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlCompoundOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlDeleteOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.palette.UmlToolPaletteItemProvider;
import com.eclipsesource.uml.glsp.validator.UmlDiagramModelValidator;

public class UmlGLSPModule extends EMSGLSPModule {

   @Override
   protected void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      super.configureActionHandlers(bindings);
      bindings.add(UmlGetTypesActionHandler.class);
   }

   @Override
   protected Class<? extends OperationHandlerRegistry> bindOperationHandlerRegistry() {
      return UmlDIOperationHandlerRegistry.class;
   }

   @Override
   protected Class<? extends EMSModelState> bindGModelState() {
      return UmlModelState.class;
   }

   @Override
   public Class<? extends GModelFactory> bindGModelFactory() {
      return UmlModelFactory.class;
   }

   @Override
   protected Class<? extends ModelSourceLoader> bindSourceModelLoader() {
      return UmlModelSourceLoader.class;
   }

   @Override
   protected Class<? extends LayoutEngine> bindLayoutEngine() {
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
      bindings.rebind(CompoundOperationHandler.class, UmlCompoundOperationHandler.class);
      bindings.rebind(ApplyLabelEditOperationHandler.class, UmlLabelEditOperationHandler.class);
      bindings.rebind(ChangeBoundsOperationHandler.class, UmlChangeBoundsOperationHandler.class);
      bindings.rebind(ChangeRoutingPointsHandler.class, UmlChangeRoutingPointsOperationHandler.class);
      bindings.rebind(DeleteOperationHandler.class, UmlDeleteOperationHandler.class);
      bindings.add(LayoutOperationHandler.class);
   }

   @Override
   protected Class<? extends DiagramConfiguration> bindDiagramConfiguration() {
      return UmlDiagramConfiguration.class;
   }

   @Override
   protected Class<? extends ModelValidator> bindModelValidator() {
      return UmlDiagramModelValidator.class;
   }

   @Override
   protected Class<? extends ContextMenuItemProvider> bindContextMenuItemProvider() {
      return UmlContextMenuItemProvider.class;
   }

   @Override
   public String getDiagramType() { return "umldiagram"; }
}
