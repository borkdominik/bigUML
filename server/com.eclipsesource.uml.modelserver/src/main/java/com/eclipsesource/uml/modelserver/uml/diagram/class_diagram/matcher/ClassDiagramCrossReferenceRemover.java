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
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.extension.CrossReferenceMatcher;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.RemoveGeneralizationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.SetPropertyTypeSemanticCommand;

public class ClassDiagramCrossReferenceRemover {
   protected final Model model;
   protected final CrossReferenceMatcher<Command> matcher;

   public ClassDiagramCrossReferenceRemover(final EditingDomain domain, final URI modelUri) {
      super();

      model = UmlSemanticUtil.getModel(modelUri, domain);
      matcher = new CrossReferenceMatcher.Builder<Command>()
         .match(PropertyMatcher::isPropertyTypeUsage, (setting, context) -> {
            var property = (Property) setting.getEObject();
            return new SetPropertyTypeSemanticCommand(domain, modelUri, property, null);
         })
         .match(PropertyMatcher::isAssociationUsage, (setting, context) -> {
            var property = (Property) setting.getEObject();
            return new RemoveAssociationCompoundCommand(domain, modelUri, property.getAssociation());
         })
         .match(GeneralizationMatcher::isUsage, (setting, context) -> {
            var generalization = (Generalization) setting.getEObject();
            return new RemoveGeneralizationCompoundCommand(domain, modelUri, generalization);
         }).build();
   }

   public List<Command> removeCommandsFor(final EObject elementToRemove) {
      return matcher.find(elementToRemove, model.eResource());
   }
}
