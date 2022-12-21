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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher;

import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.extension.CrossReferenceMatcher;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.RemoveGeneralizationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.RemovePropertySemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.SetPropertyTypeSemanticCommand;

public class ClassDiagramCrossReferenceRemover {
   protected final Model model;
   protected final CrossReferenceMatcher<Command> matcher;

   public ClassDiagramCrossReferenceRemover(final ModelContext context) {
      super();

      model = UmlSemanticUtil.getModel(context);
      matcher = new CrossReferenceMatcher.Builder<Command>()
         .match((setting, interest) -> PropertyMatcher
            .ofOwnedAttributeTypeUsage(setting, interest)
            .map(property -> new SetPropertyTypeSemanticCommand(context, property, null)))
         .match((setting, interest) -> PropertyMatcher
            .ofOwnedAttributeAssociationUsage(setting, interest)
            .map(
               property -> new RemovePropertySemanticCommand(context, (AttributeOwner) property.getOwner(), property)))
         .match((setting, interest) -> AssociationMatcher
            .ofUsage(setting, interest)
            .map(association -> new RemoveAssociationCompoundCommand(context, association.getPackage(), association)))
         .match((setting, interest) -> GeneralizationMatcher
            .ofUsage(setting, interest)
            .map(generalization -> new RemoveGeneralizationCompoundCommand(context, generalization.getSpecific(),
               generalization)))
         .build();
   }

   public List<Command> removeCommandsFor(final EObject elementToRemove) {
      return matcher.find(elementToRemove, model.eResource());
   }
}
