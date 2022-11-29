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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator.PropertyNameGenerator;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.util.ClassSemanticCommandUtil;
import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public class AddPropertySemanticCommand extends UmlSemanticElementCommand {

   protected Property newProperty;
   protected final Class parent;
   protected final Type defaultType;
   protected final ContextualNameGenerator<Class> nameGenerator;

   public AddPropertySemanticCommand(final EditingDomain domain, final URI modelUri,
      final Class parent) {
      super(domain, modelUri);
      this.parent = parent;
      this.defaultType = ClassSemanticCommandUtil.getType(domain, "String");
      this.nameGenerator = new PropertyNameGenerator();
   }

   @Override
   protected void doExecute() {
      newProperty = parent.createOwnedAttribute(nameGenerator.newNameInContextOf(parent), defaultType);
   }
}
