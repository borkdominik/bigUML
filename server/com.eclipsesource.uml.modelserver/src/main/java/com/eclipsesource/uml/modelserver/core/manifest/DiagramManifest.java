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
package com.eclipsesource.uml.modelserver.core.manifest;

import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionBinderSupplier;
import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionIdSupplier;
import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionRepresentationSupplier;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.AbstractModule;
import com.google.inject.Binder;

public abstract class DiagramManifest extends AbstractModule
   implements ContributionBinderSupplier, ContributionIdSupplier, ContributionRepresentationSupplier {

   protected final Representation representation;

   public DiagramManifest(final Representation representation) {
      super();
      this.representation = representation;
   }

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return this.representation;
   }

   @Override
   public Binder contributionBinder() {
      return binder();
   }
}
