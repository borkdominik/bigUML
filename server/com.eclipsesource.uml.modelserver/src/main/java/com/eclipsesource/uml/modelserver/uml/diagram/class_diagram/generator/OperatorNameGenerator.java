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

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public class OperatorNameGenerator implements ContextualNameGenerator<Class> {

   @Override
   public String newNameInContextOf(final Class element) {
      var attributeCounter = element.getOwnedOperations().size();

      return "new" + Operation.class.getSimpleName() + attributeCounter;
   }

}
