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
package com.eclipsesource.uml.modelserver.uml.manifest;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.uml.behavior.Behavior;
import com.eclipsesource.uml.modelserver.uml.behavior.BehaviorContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.AbstractModule;
import com.google.inject.Binder;
import com.google.inject.multibindings.Multibinder;

public abstract class ElementDefinition extends AbstractModule
   implements BehaviorContribution {

   protected final String id;
   protected final Representation representation;

   public ElementDefinition(final String id, final Representation representation) {
      super();
      this.id = id;
      this.representation = representation;
   }

   @Override
   public String id() {
      return this.id;
   }

   @Override
   public Representation representation() {
      return this.representation;
   }

   @Override
   public Binder contributionBinder() {
      return binder();
   }

   @Override
   protected void configure() {
      super.configure();

      contributeBehaviors(this::behaviors);
   }

   protected void behaviors(
      final Multibinder<Behavior<? extends EObject>> contributions) {

   }
}
