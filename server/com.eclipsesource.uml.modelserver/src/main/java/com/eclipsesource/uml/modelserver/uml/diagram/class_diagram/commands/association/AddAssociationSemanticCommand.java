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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator.AssociationEndNameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public class AddAssociationSemanticCommand extends UmlSemanticElementCommand {

   protected final Association newAssociation;
   protected final Type source;
   protected final Type target;
   protected final AssociationType type;
   protected final ContextualNameGenerator<Type> nameGenerator;

   public AddAssociationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Type source, final Type target, final AssociationType type) {
      super(domain, modelUri);
      this.newAssociation = UMLFactory.eINSTANCE.createAssociation();
      this.source = source;
      this.target = target;
      this.type = type;
      this.nameGenerator = new AssociationEndNameGenerator();
   }

   @Override
   protected void doExecute() {
      var sourceProperty = getNewAssociation().createOwnedEnd(nameGenerator.newNameInContextOf(source), source);

      sourceProperty.setAggregation(type.toAggregationKind());
      sourceProperty.setLower(1);
      sourceProperty.setUpper(1);

      var targetProperty = getNewAssociation().createOwnedEnd(nameGenerator.newNameInContextOf(target), target);
      targetProperty.setLower(1);
      targetProperty.setUpper(1);

      model.getPackagedElements().add(getNewAssociation());
   }

   public Association getNewAssociation() { return newAssociation; }
}
