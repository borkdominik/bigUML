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
package com.eclipsesource.uml.glsp.uml.representation.use_case.elements.association;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.glsp.uml.elements.association.gmodel.AssociationGModelMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class UseCaseAssociationEdgeMapper extends AssociationGModelMapper {

   @Inject
   public UseCaseAssociationEdgeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GEdge map(final Association source) {
      return new GUseCaseAssociationBuilder<>(gmodelContext, source, configuration().typeId()).buildGModel();
   }
}
