/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.core;

import org.eclipse.glsp.server.actions.ActionHandler;
import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.features.core.model.GModelFactory;
import org.eclipse.glsp.server.operations.OperationHandler;

import com.borkdominik.big.glsp.server.core.BGEMFDiagramModule;
import com.borkdominik.big.glsp.server.core.model.BGModelRepresentation;
import com.borkdominik.big.glsp.server.core.model.integrations.BGEMFSourceModelStorage;
import com.borkdominik.big.glsp.uml.core.gmodel.UMLGModelFactory;
import com.borkdominik.big.glsp.uml.core.handler.UMLBatchCreateOperationHandler;
import com.borkdominik.big.glsp.uml.core.model.UMLModelMigrator;
import com.borkdominik.big.glsp.uml.core.model.UMLModelRepresentation;
import com.borkdominik.big.glsp.uml.core.model.UMLSourceModelStorage;
import com.google.inject.Singleton;

public class UMLDiagramModule extends BGEMFDiagramModule {

   @Override
   protected void configureAdditionals() {
      super.configureAdditionals();

      bind(UMLModelMigrator.class).in(Singleton.class);
   }

   @Override
   protected void configureActionHandlers(MultiBinding<ActionHandler> bindings) {
      super.configureActionHandlers(bindings);

      bindings.add(UMLBatchCreateOperationHandler.class);

   }

   @Override
   protected Class<? extends BGModelRepresentation> bindBGModelStateRepresentation() {
      return UMLModelRepresentation.class;
   }

   @Override
   protected Class<? extends GModelFactory> bindGModelFactory() {
      return UMLGModelFactory.class;
   }

   @Override
   protected Class<? extends BGEMFSourceModelStorage> bindSourceModelStorage() {
      return UMLSourceModelStorage.class;
   }

   @Override
   public String getDiagramType() {
      return "umldiagram";
   }

}
