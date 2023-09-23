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
package com.eclipsesource.uml.modelserver.uml.elements.association.commands;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.uml.elements.classifier.UpdateClassifierArgument;

public class UpdateAssociationArgument extends UpdateClassifierArgument {
   protected List<String> endTypeIds;

   public Optional<List<String>> endTypeIds() {
      return Optional.ofNullable(endTypeIds);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateAssociationArgument>
      extends UpdateClassifierArgument.Builder<TArgument> {

      public Builder<TArgument> endTypeIds(final List<String> value) {
         argument.endTypeIds = value;
         return this;
      }

      public Builder<TArgument> endTypes(final List<Type> value, final EMFIdGenerator id) {
         argument.endTypeIds = value.stream().map(v -> id.getOrCreateId(v)).collect(Collectors.toUnmodifiableList());
         return this;
      }
   }
}
