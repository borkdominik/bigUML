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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.property;

import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.util.PropertyUtil;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreatePropertySemanticCommand extends BaseCreateSemanticChildCommand<AttributeOwner, Property> {

   protected final Type defaultType;

   public CreatePropertySemanticCommand(final ModelContext context,
      final AttributeOwner parent) {
      super(context, parent);
      this.defaultType = PropertyUtil.getType(context.domain, "String");
   }

   @Override
   protected Property createSemanticElement(final AttributeOwner parent) {
      var nameGenerator = new ListNameGenerator(Property.class, parent.getOwnedAttributes());

      var property = parent.createOwnedAttribute(nameGenerator.newName(), defaultType);
      property.setLower(1);
      property.setUpper(1);

      return property;
   }

}
