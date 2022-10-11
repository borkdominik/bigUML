/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationGModelFactory;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.emf.model.notation.Diagram;

import com.google.inject.Inject;

public class UmlGModelFactory extends EMSNotationGModelFactory {

   @Inject
   private UmlDiagramMapper mapper;

   @Override
   protected void fillRootElement(final GModelRoot newRoot) {
      EcoreUtil.resolveAll(modelState.getSemanticModel());
      var resource = modelState.getSemanticModel().eResource();
      var id = EcoreUtil.getURI(modelState.getSemanticModel());
      super.fillRootElement(newRoot);
   }

   @Override
   protected void fillRootElement(final EObject semanticModel, final Diagram notationModel, final GModelRoot newRoot) {
      GGraph graph = GGraph.class.cast(newRoot);
      mapper.map(graph, notationModel);
   }

}
