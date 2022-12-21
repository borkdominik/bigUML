/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.CreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator.PropertyNameGenerator;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.util.ClassSemanticCommandUtil;
import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public class AddPropertySemanticCommand extends CreateSemanticChildCommand<AttributeOwner, Property> {

   protected final Type defaultType;
   protected final ContextualNameGenerator<AttributeOwner> nameGenerator;

   public AddPropertySemanticCommand(final ModelContext context,
      final AttributeOwner parent) {
      super(context, parent);
      this.defaultType = ClassSemanticCommandUtil.getType(context.domain, "String");
      this.nameGenerator = new PropertyNameGenerator();
   }

   @Override
   protected Property createSemanticElement(final AttributeOwner parent) {
      var property = parent.createOwnedAttribute(nameGenerator.newNameInContextOf(parent), defaultType);
      property.setLower(1);
      property.setUpper(1);

      return property;
   }

}
