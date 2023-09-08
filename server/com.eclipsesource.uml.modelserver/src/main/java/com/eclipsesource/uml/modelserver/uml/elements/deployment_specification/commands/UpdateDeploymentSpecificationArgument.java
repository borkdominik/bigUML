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
package com.eclipsesource.uml.modelserver.uml.elements.deployment_specification.commands;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.uml.elements.artifact.commands.UpdateArtifactArgument;

public class UpdateDeploymentSpecificationArgument extends UpdateArtifactArgument {
   protected String deploymentLocation;
   protected String executionLocation;

   public Optional<String> deploymentLocation() {
      return Optional.ofNullable(deploymentLocation);
   }

   public Optional<String> executionLocation() {
      return Optional.ofNullable(executionLocation);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateDeploymentSpecificationArgument>
      extends UpdateArtifactArgument.Builder<TArgument> {

      public Builder<TArgument> deploymentLocation(final String value) {
         argument.deploymentLocation = value;
         return this;
      }

      public Builder<TArgument> executionLocation(final String value) {
         argument.executionLocation = value;
         return this;
      }

   }
}
