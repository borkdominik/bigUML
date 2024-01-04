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
package com.eclipsesource.uml.glsp.uml.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GNode;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public abstract class RepresentationGNodeMapper<TSource extends EObject, TTarget extends GNode>
   extends BaseGNodeMapper<TSource, TTarget> implements RepresentationElementConfigurationAccessor {

   protected Representation representation;

   @Inject
   protected ElementConfigurationRegistry configurationRegistry;

   public RepresentationGNodeMapper(final Representation representation) {
      this.representation = representation;
   }

   @Override
   public Class<? extends EObject> getElementType() {
      return sourceType;
   }

   @Override
   public Representation representation() {
      return representation;
   }

   @Override
   public ElementConfigurationRegistry configurationRegistry() {
      return configurationRegistry;
   }

}
