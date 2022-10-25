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

import java.util.List;

import org.eclipse.uml2.uml.NamedElement;

public class ListNameGenerator extends UniqueCountNameGenerator {
   protected final List<? extends NamedElement> elements;

   public ListNameGenerator(final Class<? extends NamedElement> clazz, final List<? extends NamedElement> elements) {
      super(clazz, elements.size() + 1);
      this.elements = elements;
   }

   @Override
   protected boolean isUnique(final String name) {
      return elements.stream().noneMatch(element -> element.getName().equals(name));
   }

}
