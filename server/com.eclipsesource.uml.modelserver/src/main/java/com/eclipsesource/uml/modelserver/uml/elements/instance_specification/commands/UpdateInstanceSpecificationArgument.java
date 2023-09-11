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
package com.eclipsesource.uml.modelserver.uml.elements.instance_specification.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateInstanceSpecificationArgument extends UpdateNamedElementArgument {
   protected String classifierId;

   public Optional<String> classifierId() {
      return Optional.ofNullable(classifierId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateInstanceSpecificationArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> classifierId(final Classifier value, final EMFIdGenerator id) {
         argument.classifierId = id.getOrCreateId(value);
         return this;
      }

   }
}
