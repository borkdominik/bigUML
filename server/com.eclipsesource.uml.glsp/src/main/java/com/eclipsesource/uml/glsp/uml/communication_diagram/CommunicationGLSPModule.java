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
package com.eclipsesource.uml.glsp.uml.communication_diagram;

import org.eclipse.emfcloud.modelserver.glsp.EMSGLSPModule;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.EMSOperationActionHandler;
import org.eclipse.emfcloud.modelserver.glsp.model.EMSModelState;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.diagram.DiagramConfiguration;
import org.eclipse.glsp.server.features.clipboard.RequestClipboardDataActionHandler;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.core.model.GModelFactory;
import org.eclipse.glsp.server.features.core.model.ModelSourceLoader;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperationHandler;
import org.eclipse.glsp.server.features.directediting.LabelEditValidator;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.features.validation.RequestMarkersHandler;
import org.eclipse.glsp.server.layout.LayoutEngine;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.operations.OperationHandlerRegistry;
import org.eclipse.glsp.server.operations.gmodel.ChangeBoundsOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.ChangeRoutingPointsHandler;
import org.eclipse.glsp.server.operations.gmodel.CompoundOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.DeleteOperationHandler;
import org.eclipse.glsp.server.operations.gmodel.LayoutOperationHandler;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.UmlDIOperationHandlerRegistry;
import com.eclipsesource.uml.glsp.actions.ReturnTypesAction;
import com.eclipsesource.uml.glsp.actions.SetOutlineAction;
import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.actions.UmlOperationActionHandler;
import com.eclipsesource.uml.glsp.actions.UmlRequestClipboardDataActionHandler;
import com.eclipsesource.uml.glsp.actions.UmlRequestMarkersHandler;
import com.eclipsesource.uml.glsp.actions.UmlRequestOutlineHandler;
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
import com.eclipsesource.uml.glsp.outline.CommunicationOutlineGenerator;
import com.eclipsesource.uml.glsp.outline.DefaultOutlineGenerator;
import com.eclipsesource.uml.glsp.palette.UmlToolPaletteItemProvider;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateInteractionNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateLifelineNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateMessageEdgeOperationHandler;
import com.eclipsesource.uml.glsp.validation.validators.CommunicationLabelEditValidator;
import com.eclipsesource.uml.glsp.validation.validators.CommunicationModelValidator;
import com.eclipsesource.uml.glsp.validation.validators.CommunicationValidator;
import com.eclipsesource.uml.glsp.validation.validators.InteractionValidator;
import com.eclipsesource.uml.glsp.validation.validators.LifelineValidator;
import com.eclipsesource.uml.glsp.validation.validators.MessageValidator;
import com.eclipsesource.uml.glsp.validation.validators.Validator;
import com.eclipsesource.uml.glsp.validator.UmlDiagramModelValidator;
import com.google.inject.TypeLiteral;

public class CommunicationGLSPModule extends EMSGLSPModule {

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
      bindings.add(SetOutlineAction.class);
   }

   @Override
   protected void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      super.configureActionHandlers(bindings);
      bindings.rebind(RequestClipboardDataActionHandler.class, UmlRequestClipboardDataActionHandler.class);
      bindings.rebind(EMSOperationActionHandler.class, UmlOperationActionHandler.class);
      bindings.rebind(RequestMarkersHandler.class, UmlRequestMarkersHandler.class);
      bindings.add(UmlRequestOutlineHandler.class);
      bindings.add(UmlGetTypesActionHandler.class);

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

      // UML Communication
      bindings.add(CreateInteractionNodeOperationHandler.class);
      bindings.add(CreateLifelineNodeOperationHandler.class);
      bindings.add(CreateMessageEdgeOperationHandler.class);
   }

   @Override
   protected void configureAdditionals() {
      super.configureAdditionals();
      bind(ModelValidator.class).annotatedWith(CommunicationValidator.class)
         .to(CommunicationModelValidator.class);
      bind(LabelEditValidator.class).annotatedWith(CommunicationValidator.class)
         .to(CommunicationLabelEditValidator.class);
      bind(new TypeLiteral<Validator<Interaction>>() {}).annotatedWith(CommunicationValidator.class)
         .to(InteractionValidator.class);
      bind(new TypeLiteral<Validator<Lifeline>>() {}).annotatedWith(CommunicationValidator.class)
         .to(LifelineValidator.class);
      bind(new TypeLiteral<Validator<Message>>() {}).annotatedWith(CommunicationValidator.class)
         .to(MessageValidator.class);

      bind(DefaultOutlineGenerator.class);
      bind(CommunicationOutlineGenerator.class);
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
