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
package com.eclipsesource.uml.modelserver.uml.elements.package_merge.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementArgument;

public class UpdatePackageMergeArgument extends UpdateElementArgument {
   protected String mergedPackageId;
   protected String nearestPackageId;

   public Optional<String> mergedPackageId() {
      return Optional.ofNullable(mergedPackageId);
   }

   public Optional<String> nearestPackageId() {
      return Optional.ofNullable(nearestPackageId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdatePackageMergeArgument>
      extends UpdateElementArgument.Builder<TArgument> {

      public Builder<TArgument> mergedPackageId(final String value) {
         argument.mergedPackageId = value;
         return this;
      }

      public Builder<TArgument> mergedPackage(final org.eclipse.uml2.uml.Package value, final EMFIdGenerator id) {
         argument.mergedPackageId = id.getOrCreateId(value);
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
