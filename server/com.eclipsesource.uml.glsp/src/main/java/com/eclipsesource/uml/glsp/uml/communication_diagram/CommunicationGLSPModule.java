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

import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.GLSPModule;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.actions.SetOutlineAction;
import com.eclipsesource.uml.glsp.actions.UmlRequestOutlineHandler;
import com.eclipsesource.uml.glsp.diagram.UmlDiagramConfigurationProvider;
import com.eclipsesource.uml.glsp.operations.UmlDiagramDeleteOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlDiagramLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.outline.CommunicationOutlineGenerator;
import com.eclipsesource.uml.glsp.outline.DefaultOutlineGenerator;
import com.eclipsesource.uml.glsp.palette.UmlDiagramPaletteItemProvider;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CommunicationDeleteOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CommunicationLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateInteractionNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateLifelineNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateMessageEdgeOperationHandler;
import com.google.inject.multibindings.Multibinder;

public class CommunicationGLSPModule extends GLSPModule {
   @Override
   protected void configureBase() {
      configure(MultiBinding.create(Action.class).setAnnotationName(CLIENT_ACTIONS), this::configureClientActions);
      configure(MultiBinding.create(ActionHandler.class), this::configureActionHandlers);
      configure(MultiBinding.create(OperationHandler.class), this::configureOperationHandlers);

      var paletteProvider = Multibinder.newSetBinder(binder(), UmlDiagramPaletteItemProvider.class);
      paletteProvider.addBinding().to(CommunicationPalette.class);

      var diagramProvider = Multibinder.newSetBinder(binder(), UmlDiagramConfigurationProvider.class);
      diagramProvider.addBinding().to(CommunicationDiagramConfiguration.class);

      var deleteOperationProvider = Multibinder.newSetBinder(binder(), UmlDiagramDeleteOperationHandler.class);
      deleteOperationProvider.addBinding().to(CommunicationDeleteOperationHandler.class);

      var editLabelOperationProvider = Multibinder.newSetBinder(binder(), UmlDiagramLabelEditOperationHandler.class);
      editLabelOperationProvider.addBinding().to(CommunicationLabelEditOperationHandler.class);
   }

   public void configureClientActions(final MultiBinding<Action> bindings) {
      bindings.add(SetOutlineAction.class);
   }

   public void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      bindings.add(UmlRequestOutlineHandler.class);
   }

   public void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      bindings.add(CreateInteractionNodeOperationHandler.class);
      bindings.add(CreateLifelineNodeOperationHandler.class);
      bindings.add(CreateMessageEdgeOperationHandler.class);
   }

   @Override
   public void configureAdditionals() {
      bind(DefaultOutlineGenerator.class);
      bind(CommunicationOutlineGenerator.class);

      /*
       * TODO: Enable for validation
       * bind(ModelValidator.class).annotatedWith(CommunicationValidator.class)
       * .to(CommunicationModelValidator.class);
       * bind(LabelEditValidator.class).annotatedWith(CommunicationValidator.class)
       * .to(CommunicationLabelEditValidator.class);
       * bind(new TypeLiteral<Validator<Interaction>>() {}).annotatedWith(CommunicationValidator.class)
       * .to(InteractionValidator.class);
       * bind(new TypeLiteral<Validator<Lifeline>>() {}).annotatedWith(CommunicationValidator.class)
       * .to(LifelineValidator.class);
       * bind(new TypeLiteral<Validator<Message>>() {}).annotatedWith(CommunicationValidator.class)
       * .to(MessageValidator.class);
       */
   }
}
