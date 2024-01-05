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
package com.eclipsesource.uml.glsp.uml.elements.realization.gmodel;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.Realization;

import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGEdgeMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class RealizationGModelMapper extends RepresentationGEdgeMapper<Realization, GEdge> {

   @Inject
   public RealizationGModelMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final Realization source) {
      return new GRealizationBuilder<>(gmodelContext, source, configuration().typeId()).buildGModel();
   }
}
