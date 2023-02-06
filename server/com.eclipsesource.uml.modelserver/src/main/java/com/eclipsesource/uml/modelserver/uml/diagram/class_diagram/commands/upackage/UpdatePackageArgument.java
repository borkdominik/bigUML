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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.PackageMerge;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdatePackageArgument implements EmbeddedCodec.JsonEncodable {
   private final String name;
   private final String label;
   private final String uri;
   private final VisibilityKind visibilityKind;
   private final List<PackageMerge> ownedPackageMerges;

   public UpdatePackageArgument(final String name, final String label, final String uri,
      final VisibilityKind visibilityKind,
      final List<PackageMerge> ownedPackageMerges) {
      super();
      this.name = name;
      this.label = label;
      this.uri = uri;
      this.visibilityKind = visibilityKind;
      this.ownedPackageMerges = ownedPackageMerges;
   }

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<String> uri() {
      return Optional.ofNullable(uri);
   }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<List<PackageMerge>> ownedPackageMerges() {
      return Optional.ofNullable(ownedPackageMerges);
   }

   public static final class Builder {
      private String uri;
      private VisibilityKind visibilityKind;

      public Builder uri(final String value) {
         this.uri = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         this.visibilityKind = value;
         return this;
      }

      public UpdatePackageArgument build() {
         return new UpdatePackageArgument(null, null, uri, visibilityKind, null);
      }
   }
}
