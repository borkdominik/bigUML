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
package com.eclipsesource.uml.modelserver.core.model;

import java.io.IOException;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.emf.common.DefaultModelRepository;
import org.eclipse.emfcloud.modelserver.emf.configuration.ServerConfiguration;

import com.eclipsesource.uml.modelserver.core.resource.UmlModelResourceManager;
import com.eclipsesource.uml.modelserver.model.NewDiagramRequest;
import com.google.inject.Inject;

public class UmlModelRepository extends DefaultModelRepository {

   @Inject
   protected UmlModelResourceManager modelResourceManager;

   @Inject
   public UmlModelRepository(final ServerConfiguration serverConfiguration) {
      super(serverConfiguration);
   }

   @Override
   public void addModel(final String modeluri, final EObject model) throws IOException {
      if (model instanceof NewDiagramRequest) {
         var request = (NewDiagramRequest) model;
         modelResourceManager.createUmlModel(modeluri, request.getDiagramType());
      } else {
         super.addModel(modeluri, model);
      }
   }

}
