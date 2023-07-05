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
package com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import;

import java.util.Optional;

import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.util.PackageUtils;

public final class UpdatePackageImportArgument implements EmbeddedCodec.JsonEncodable {
   private VisibilityKind visibilityKind;

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public static final class Builder {
      private final UpdatePackageImportArgument argument = new UpdatePackageImportArgument();

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public UpdatePackageImportArgument get() {
         PackageUtils.validateVisiblity(argument.visibilityKind);
         return argument;
      }
   }
}
