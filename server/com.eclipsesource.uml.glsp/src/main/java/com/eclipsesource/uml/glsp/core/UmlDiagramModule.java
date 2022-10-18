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
package com.eclipsesource.uml.glsp.core;

import org.eclipse.emfcloud.modelserver.glsp.EMSModelState;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.EMSOperationActionHandler;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSGLSPNotationDiagramModule;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelServerAccess;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelState;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationResource;
import org.eclipse.glsp.graph.GraphExtension;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.diagram.DiagramConfiguration;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.idgen.FragmentIdGenerator;
import org.eclipse.glsp.server.features.contextmenu.ContextMenuItemProvider;
import org.eclipse.glsp.server.features.core.model.GModelFactory;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.operations.OperationHandler;
import org.eclipse.glsp.server.operations.OperationHandlerRegistry;
import org.eclipse.uml2.uml.UMLPackage;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.glsp.core.contextmenu.UmlContextMenuItemProvider;
import com.eclipsesource.uml.glsp.core.diagram.UmlToolDiagramConfiguration;
import com.eclipsesource.uml.glsp.core.gmodel.UmlDiagramMapper;
import com.eclipsesource.uml.glsp.core.gmodel.UmlGModelFactory;
import com.eclipsesource.uml.glsp.core.gmodel.UmlGModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.UmlGModelMapperRegistry;
import com.eclipsesource.uml.glsp.core.handler.action.UmlOperationActionHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.DiagramDeleteHandlerRegistry;
import com.eclipsesource.uml.glsp.core.handler.operation.UmlDeleteOperationHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.UmlLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.UmlOperationHandlerRegistry;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.palette.UmlToolPaletteItemProvider;
import com.eclipsesource.uml.glsp.core.type.TypeRegistry;
import com.eclipsesource.uml.glsp.features.outline.manifest.OutlineManifest;
import com.eclipsesource.uml.glsp.features.validation.UmlDiagramModelValidator;
import com.eclipsesource.uml.glsp.old.diagram.activity_diagram.actions.ReturnTypesAction;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.manifest.CommunicationUmlManifest;
import com.google.inject.Singleton;

public class UmlDiagramModule extends EMSGLSPNotationDiagramModule {

   @Override
   protected void configureBase() {
      super.configureBase();
      bind(EMSModelState.class).to(bindGModelState());
      bind(EMSNotationModelState.class).to(bindGModelState());

      bind(UmlDiagramMapper.class).in(Singleton.class);
      bind(UmlGModelMapHandler.class).in(Singleton.class);
      bind(UmlGModelMapperRegistry.class).in(Singleton.class);

      bind(TypeRegistry.class).in(Singleton.class);
      bind(DiagramDeleteHandlerRegistry.class).in(Singleton.class);
   }

   @Override
   protected void registerEPackages() {
      super.registerEPackages();
      UMLPackage.eINSTANCE.eClass();
   }

   @Override
   protected Class<? extends EMFIdGenerator> bindEMFIdGenerator() {
      return FragmentIdGenerator.class;
   }

   @Override
   protected Class<? extends EMSNotationModelState> bindGModelState() {
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
   protected Class<? extends OperationHandlerRegistry> bindOperationHandlerRegistry() {
      return UmlOperationHandlerRegistry.class;
   }

   @Override
   public String getDiagramType() { return "umldiagram"; }

   @Override
   protected String getSemanticFileExtension() { return UMLResource.FILE_EXTENSION; }

   @Override
   protected String getNotationFileExtension() { return NotationResource.FILE_EXTENSION; }

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

      bindings.rebind(EMSOperationActionHandler.class, UmlOperationActionHandler.class);
   }

   @Override
   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      super.configureOperationHandlers(bindings);
      bindings.add(UmlLabelEditOperationHandler.class);
      bindings.add(UmlDeleteOperationHandler.class);
   }

   @Override
   protected void configureAdditionals() {
      super.configureAdditionals();

      install(new OutlineManifest());
      // install(new CommonUmlManifest());
      install(new CommunicationUmlManifest());
   }
}
