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
package com.eclipsesource.uml.modelserver.uml.elements.package_import.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementArgument;

public class UpdatePackageImportArgument extends UpdateElementArgument {
   protected VisibilityKind visibilityKind;
   protected String importedPackageId;
   protected String nearestPackageId;

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<String> importedPackageId() {
      return Optional.ofNullable(importedPackageId);
   }

   public Optional<String> nearestPackageId() {
      return Optional.ofNullable(nearestPackageId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdatePackageImportArgument>
      extends UpdateElementArgument.Builder<TArgument> {

      public Builder<TArgument> visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public Builder<TArgument> importedPackageId(final String value) {
         argument.importedPackageId = value;
         return this;
      }

      public Builder<TArgument> importedPackage(final org.eclipse.uml2.uml.Package value, final EMFIdGenerator id) {
         argument.importedPackageId = id.getOrCreateId(value);
         return this;
      }

      public Builder<TArgument> nearestPackageId(final String value) {
         argument.nearestPackageId = value;
         return this;
      }

      public Builder<TArgument> nearestPackage(final org.eclipse.uml2.uml.Package value, final EMFIdGenerator id) {
         argument.nearestPackageId = id.getOrCreateId(value);
         return this;
      }
   }
}
