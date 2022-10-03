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

import org.eclipse.emfcloud.modelserver.glsp.EMSModelState;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.EMSOperationActionHandler;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSGLSPNotationDiagramModule;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelServerAccess;
import org.eclipse.glsp.graph.GraphExtension;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.diagram.DiagramConfiguration;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.core.model.GModelFactory;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.layout.LayoutEngine;
import org.eclipse.glsp.server.operations.LayoutOperationHandler;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.glsp.actions.ReturnTypesAction;
import com.eclipsesource.uml.glsp.actions.UmlOperationActionHandler;
import com.eclipsesource.uml.glsp.contextmenu.UmlContextMenuItemProvider;
import com.eclipsesource.uml.glsp.diagram.UmlToolDiagramConfiguration;
import com.eclipsesource.uml.glsp.features.outline.manifest.OutlineManifest;
import com.eclipsesource.uml.glsp.features.validation.UmlDiagramModelValidator;
import com.eclipsesource.uml.glsp.gmodel.UmlDiagramMapper;
import com.eclipsesource.uml.glsp.gmodel.UmlGModelMapHandler;
import com.eclipsesource.uml.glsp.gmodel.UmlGModelMapperRegistry;
import com.eclipsesource.uml.glsp.layout.UmlLayoutEngine;
import com.eclipsesource.uml.glsp.model.UmlGModelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.operations.UmlDeleteOperationHandler;
import com.eclipsesource.uml.glsp.operations.UmlLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.palette.UmlToolPaletteItemProvider;
import com.eclipsesource.uml.glsp.uml.communication_diagram.manifest.CommunicationUmlManifest;
import com.google.inject.Singleton;

public class UmlDiagramModule extends EMSGLSPNotationDiagramModule {

   @Override
   protected void registerEPackages() {
      super.registerEPackages();
      UMLPackage.eINSTANCE.eClass();
   }

   @Override
   protected Class<? extends EMSModelState> bindGModelState() {
      return UmlModelState.class;
   }

   @Override
   public Class<? extends GModelFactory> bindGModelFactory() {
      return UmlGModelFactory.class;
   }

   @Override
   protected Class<? extends EMSNotationModelServerAccess> bindModelServerAccess() {
      return UmlModelServerAccess.class;
   }

   @Override
   protected Class<? extends GraphExtension> bindGraphExtension() {
      return UmlGraphExtension.class;
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
   protected Class<? extends DiagramConfiguration> bindDiagramConfiguration() {
      return UmlToolDiagramConfiguration.class;
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

   @Override
   protected String getSemanticFileExtension() { return "uml"; }

   @Override
   protected String getNotationFileExtension() { return "unotation"; }

   @Override
   protected void configureClientActions(final MultiBinding<Action> bindings) {
      super.configureClientActions(bindings);
      bindings.add(ReturnTypesAction.class);
   }

   @Override
   protected void configureActionHandlers(final MultiBinding<ActionHandler> bindings) {
      super.configureActionHandlers(bindings);
      // TODO: Rebind it
      // bindings.rebind(RequestClipboardDataActionHandler.class, UmlRequestClipboardDataActionHandler.class);
      // bindings.rebind(RequestMarkersHandler.class, UmlRequestMarkersHandler.class);
      // bindings.add(UmlGetTypesActionHandler.class);

      bindings.rebind(EMSOperationActionHandler.class, UmlOperationActionHandler.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      super.configureOperationHandlers(bindings);
      bindings.add(UmlLabelEditOperationHandler.class);
      bindings.add(UmlDeleteOperationHandler.class);
      bindings.add(LayoutOperationHandler.class);
   }

   @Override
   protected void configureAdditionals() {
      super.configureAdditionals();

      bind(UmlDiagramMapper.class).in(Singleton.class);
      bind(UmlGModelMapHandler.class).in(Singleton.class);
      bind(UmlGModelMapperRegistry.class).in(Singleton.class);

      install(new OutlineManifest());
      // install(new CommonUmlManifest());
      install(new CommunicationUmlManifest());
   }
}
