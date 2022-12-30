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

import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public final class PropertyNameGenerator implements ContextualNameGenerator<AttributeOwner> {

   @Override
   public String newNameInContextOf(final AttributeOwner element) {
      var attributeCounter = element.getOwnedAttributes().size();

      return "new" + Property.class.getSimpleName() + attributeCounter;
   }

}
