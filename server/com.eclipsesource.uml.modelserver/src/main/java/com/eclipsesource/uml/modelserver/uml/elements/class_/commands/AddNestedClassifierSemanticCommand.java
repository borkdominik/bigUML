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
package com.eclipsesource.uml.modelserver.uml.elements.class_.commands;

import java.util.function.Function;
import java.util.function.Supplier;

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class AddNestedClassifierSemanticCommand
   extends BaseCreateSemanticChildCommand<Class, Classifier> {

   protected final Function<Class, Classifier> supplier;

   public AddNestedClassifierSemanticCommand(final ModelContext context,
      final Class parent, final Supplier<Classifier> supplier) {
      this(context, parent, p -> supplier.get());
   }

   public AddNestedClassifierSemanticCommand(final ModelContext context,
      final Class parent, final Function<Class, Classifier> supplier) {
      super(context, parent);
      this.supplier = supplier;
   }

   @Override
   protected Classifier createSemanticElement(final Class parent) {
      var classifier = supplier.apply(parent);
      var nameGenerator = new ListNameGenerator(classifier.getClass(), parent.allNamespaces());
      classifier.setName(nameGenerator.newName());
      parent.getNestedClassifiers().add(classifier);
      return classifier;
   }

}
