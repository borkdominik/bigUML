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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.ProtocolStateMachine;
import org.eclipse.uml2.uml.Reception;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdateInterfaceArgument implements EmbeddedCodec.JsonEncodable {
   private String name;
   private String label;
   private Boolean isAbstract;
   private VisibilityKind visibilityKind;

   // Reference
   private ProtocolStateMachine protocol;

   // References
   private List<Property> ownedAttributes;
   private List<Operation> ownedOperations;
   private List<Reception> ownedReceptions;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<ProtocolStateMachine> protocol() {
      return Optional.ofNullable(protocol);
   }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public static final class Builder {
      private final UpdateInterfaceArgument argument = new UpdateInterfaceArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public Builder label(final String value) {
         argument.label = value;
         return this;
      }

      public Builder isAbstract(final boolean value) {
         argument.isAbstract = value;
         return this;
      }

      public Builder protocol(final ProtocolStateMachine value) {
         argument.protocol = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public UpdateInterfaceArgument get() {
         return argument;
      }
   }
}
