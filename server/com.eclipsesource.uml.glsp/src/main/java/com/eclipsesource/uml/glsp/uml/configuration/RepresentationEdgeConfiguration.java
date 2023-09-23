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
package com.eclipsesource.uml.glsp.uml.configuration;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.DefaultTypes;

import com.eclipsesource.uml.glsp.uml.utils.QualifiedUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public abstract class RepresentationEdgeConfiguration<TEdge extends EObject>
   extends RepresentationElementConfiguration<TEdge> implements EdgeConfiguration<TEdge> {

   public RepresentationEdgeConfiguration(final Representation representation) {
      super(representation);
   }

   @Override
   public String typeId() {
      return QualifiedUtil.typeId(representation, DefaultTypes.EDGE,
         getElementType().getSimpleName());
   }

   @Override
   public Set<String> allTypeIds() {
      return this.getTypeMappings().keySet();
   }
}
