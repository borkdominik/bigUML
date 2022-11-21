/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator;

import java.util.function.Function;
import java.util.stream.Collectors;

import org.eclipse.uml2.uml.StructuralFeature;

import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public abstract class StructuralFeatureNameGenerator<T> implements ContextualNameGenerator<T> {

   public String getNewStructuralFeatureName(
      final Class<? extends StructuralFeature> umlStructuralFeature, final org.eclipse.uml2.uml.Class parentClass) {

      Function<Integer, String> nameProvider = i -> "new" + umlStructuralFeature.getSimpleName() + i;

      var attributeCounter = parentClass.getOwnedAttributes().stream().filter(umlStructuralFeature::isInstance)
         .collect(Collectors.toList()).size();

      return nameProvider.apply(attributeCounter);
   }
}
