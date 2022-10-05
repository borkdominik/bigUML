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
package com.eclipsesource.uml.glsp.model;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationGModelFactory;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.emf.model.notation.Diagram;

import com.eclipsesource.uml.glsp.gmodel.UmlDiagramMapper;
import com.google.inject.Inject;

public class UmlGModelFactory extends EMSNotationGModelFactory {

   @Inject
   private UmlDiagramMapper mapper;

   @Override
   protected void fillRootElement(final EObject semanticModel, final Diagram notationModel, final GModelRoot newRoot) {
      System.out.println("");
      System.out.println("FILL ROOT");
      System.out.println("");

      GGraph graph = GGraph.class.cast(newRoot);

      mapper.map(graph, notationModel);
   }

}
