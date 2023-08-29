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

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.TypeLiteral;

public abstract class RepresentationElementConfiguration<TElement extends EObject>
   implements ElementConfiguration<TElement>, ElementConfigurationAccessor {

   @Inject
   protected TypeLiteral<TElement> elementType;
   @Inject
   protected Provider<ElementConfigurationRegistry> configurationRegistry;

   protected final Representation representation;

   public RepresentationElementConfiguration(final Representation representation) {
      super();
      this.representation = representation;
   }

   @Override
   public Representation representation() {
      return representation;
   }

   @Override
   public Class<TElement> getElementType() { return (Class<TElement>) elementType.getRawType(); }

   @Override
   public ElementConfigurationRegistry configurationRegistry() {
      return configurationRegistry.get();
   }

}
