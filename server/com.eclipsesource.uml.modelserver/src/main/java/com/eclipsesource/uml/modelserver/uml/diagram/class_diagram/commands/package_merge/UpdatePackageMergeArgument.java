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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_merge;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdatePackageMergeArgument implements EmbeddedCodec.JsonEncodable {
   private String mergedPackageId;
   private String nearestPackageId;

   public Optional<String> mergedPackageId() {
      return Optional.ofNullable(mergedPackageId);
   }

   public Optional<String> nearestPackageId() {
      return Optional.ofNullable(nearestPackageId);
   }

   public static final class Builder {
      private final UpdatePackageMergeArgument argument = new UpdatePackageMergeArgument();

      public Builder mergedPackage(final org.eclipse.uml2.uml.Package value, final EMFIdGenerator id) {
         argument.mergedPackageId = id.getOrCreateId(value);
         return this;
      }

      public Builder nearestPackage(final org.eclipse.uml2.uml.Package value, final EMFIdGenerator id) {
         argument.nearestPackageId = id.getOrCreateId(value);
         return this;
      }

      public UpdatePackageMergeArgument get() {
         return argument;
      }
   }
}
