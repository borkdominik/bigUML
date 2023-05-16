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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.abstraction;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdateAbstractionArgument implements EmbeddedCodec.JsonEncodable {
   private String name;
   private String label;
   private VisibilityKind visibilityKind;
   private Set<String> clientIds;
   private Set<String> supplierIds;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<Set<String>> clientIds() {
      return Optional.ofNullable(clientIds);
   }

   public Optional<Set<String>> supplierIds() {
      return Optional.ofNullable(supplierIds);
   }

   public static final class Builder {
      private final UpdateAbstractionArgument argument = new UpdateAbstractionArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public Builder label(final String value) {
         argument.label = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public Builder clients(final Set<NamedElement> value, final EMFIdGenerator id) {
         argument.clientIds = value.stream().map(v -> id.getOrCreateId(v)).collect(Collectors.toUnmodifiableSet());
         return this;
      }

      public Builder suppliers(final Set<NamedElement> value, final EMFIdGenerator id) {
         argument.supplierIds = value.stream().map(v -> id.getOrCreateId(v)).collect(Collectors.toUnmodifiableSet());
         return this;
      }

      public UpdateAbstractionArgument get() {
         return argument;
      }
   }
}
