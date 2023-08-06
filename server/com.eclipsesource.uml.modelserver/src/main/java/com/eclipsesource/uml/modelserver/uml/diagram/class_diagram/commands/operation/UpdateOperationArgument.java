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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Behavior;
import org.eclipse.uml2.uml.CallConcurrencyKind;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;
import com.eclipsesource.uml.modelserver.shared.model.NewListIndex;

public final class UpdateOperationArgument implements EmbeddedCodec.JsonEncodable {
   private String name;
   private String label;
   private Boolean isAbstract;
   private Boolean isStatic;
   private Boolean isQuery;
   private VisibilityKind visibilityKind;
   private CallConcurrencyKind concurrency;

   // Reference
   private Constraint bodyCondition;
   private List<NewListIndex> parameterIndex;

   // References
   private List<Behavior> methods;
   private List<Parameter> ownedParameters;
   private List<Constraint> preConditions;
   private List<Constraint> postConditions;
   private List<Type> raisedExceptions;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<Boolean> isStatic() { return Optional.ofNullable(isStatic); }

   public Optional<Boolean> isQuery() { return Optional.ofNullable(isQuery); }

   public Optional<Constraint> bodyCondition() {
      return Optional.ofNullable(bodyCondition);
   }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<CallConcurrencyKind> concurrency() {
      return Optional.ofNullable(concurrency);
   }

   public Optional<List<NewListIndex>> parameterIndex() {
      return Optional.ofNullable(parameterIndex);
   }

   public static final class Builder {
      private final UpdateOperationArgument argument = new UpdateOperationArgument();

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

      public Builder isStatic(final boolean value) {
         argument.isStatic = value;
         return this;
      }

      public Builder isQuery(final boolean value) {
         argument.isQuery = value;
         return this;
      }

      public Builder bodyCondition(final Constraint value) {
         argument.bodyCondition = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public Builder concurrency(final CallConcurrencyKind value) {
         argument.concurrency = value;
         return this;
      }

      public Builder parameterIndex(final List<NewListIndex> value) {
         argument.parameterIndex = value;
         return this;
      }

      public UpdateOperationArgument get() {
         return argument;
      }
   }
}
