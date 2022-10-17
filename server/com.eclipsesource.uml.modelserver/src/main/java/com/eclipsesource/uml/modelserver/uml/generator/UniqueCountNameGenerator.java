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
package com.eclipsesource.uml.modelserver.uml.generator;

import org.eclipse.uml2.uml.NamedElement;

public abstract class UniqueCountNameGenerator implements NameGenerator {
   protected final Class<? extends NamedElement> clazz;
   protected int counter;

   public UniqueCountNameGenerator(final Class<? extends NamedElement> clazz) {
      this(clazz, 1);
   }

   public UniqueCountNameGenerator(final Class<? extends NamedElement> clazz, final int counter) {
      this.clazz = clazz;
      this.counter = counter;
   }

   @Override
   public String newName() {
      var name = name();

      while (!isUnique(name)) {
         counter++;
         name = name();
      }

      return name;
   }

   protected String name() {
      return "New" + clazz.getSimpleName() + counter;
   }

   abstract protected boolean isUnique(String name);
}
