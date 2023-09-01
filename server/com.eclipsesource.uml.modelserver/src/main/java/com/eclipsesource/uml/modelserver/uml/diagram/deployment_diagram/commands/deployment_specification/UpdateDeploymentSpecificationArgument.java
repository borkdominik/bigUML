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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment_specification;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Reception;
import org.eclipse.uml2.uml.VisibilityKind;

public final class UpdateDeploymentSpecificationArgument {
   private String name;
   private String label;
   private String fileName;
   private String deploymentLocation;
   private String executionLocation;
   private boolean isAbstract;
   private VisibilityKind visibilityKind;

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

   public Optional<String> fileName() {
      return Optional.ofNullable(fileName);
   }

   public Optional<String> deploymentLocation() {
      return Optional.ofNullable(deploymentLocation);
   }

   public Optional<String> executionLocation() {
      return Optional.ofNullable(executionLocation);
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public static final class Builder {
      private final UpdateDeploymentSpecificationArgument argument = new UpdateDeploymentSpecificationArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public Builder label(final String value) {
         argument.label = value;
         return this;
      }

      public Builder fileName(final String value) {
         argument.fileName = value;
         return this;
      }

      public Builder deploymentLocation(final String value) {
         argument.deploymentLocation = value;
         return this;
      }

      public Builder executionLocation(final String value) {
         argument.executionLocation = value;
         return this;
      }

      public Builder isAbstract(final boolean value) {
         argument.isAbstract = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public UpdateDeploymentSpecificationArgument get() {
         return argument;
      }

   }

}
