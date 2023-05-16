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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_import;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdatePackageImportArgument implements EmbeddedCodec.JsonEncodable {
   private VisibilityKind visibilityKind;
   private String importedPackageId;
   private String nearestPackageId;

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<String> importedPackageId() {
      return Optional.ofNullable(importedPackageId);
   }

   public Optional<String> nearestPackageId() {
      return Optional.ofNullable(nearestPackageId);
   }

   public static final class Builder {
      private final UpdatePackageImportArgument argument = new UpdatePackageImportArgument();

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public Builder importedPackage(final org.eclipse.uml2.uml.Package value, final EMFIdGenerator id) {
         argument.importedPackageId = id.getOrCreateId(value);
         return this;
      }

      public Builder nearestPackage(final org.eclipse.uml2.uml.Package value, final EMFIdGenerator id) {
         argument.nearestPackageId = id.getOrCreateId(value);
         return this;
      }

      public UpdatePackageImportArgument get() {
         return argument;
      }
   }
}
