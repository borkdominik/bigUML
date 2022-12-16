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
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator.PropertyNameGenerator;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.util.ClassSemanticCommandUtil;
import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public class AddPropertySemanticCommand extends UmlSemanticElementCommand {

   protected Property newProperty;
   protected final AttributeOwner parent;
   protected final Type defaultType;
   protected final ContextualNameGenerator<AttributeOwner> nameGenerator;

   public AddPropertySemanticCommand(final ModelContext context,
      final AttributeOwner parent) {
      super(context);
      this.parent = parent;
      this.defaultType = ClassSemanticCommandUtil.getType(context.domain, "String");
      this.nameGenerator = new PropertyNameGenerator();
   }

   @Override
   protected void doExecute() {
      this.newProperty = parent.createOwnedAttribute(nameGenerator.newNameInContextOf(parent), defaultType);
      this.newProperty.setLower(1);
      this.newProperty.setUpper(1);
   }
}
