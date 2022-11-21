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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.SetPropertyTypeSemanticCommand;

public class RemoveClassCompoundCommand extends CompoundCommand {

   public RemoveClassCompoundCommand(final EditingDomain domain, final URI modelUri, final Class classToRemove) {
      this.append(new RemoveClassSemanticCommand(domain, modelUri, classToRemove));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, classToRemove));

      var umlModel = UmlSemanticUtil.getModel(modelUri, domain);
      var usagesClass = UsageCrossReferencer.find(classToRemove, umlModel.eResource());

      for (Setting setting : usagesClass) {
         var eObject = setting.getEObject();
         if (isPropertyTypeUsage(setting, eObject, classToRemove)) {
            this.append(new SetPropertyTypeSemanticCommand(domain, modelUri, (Property) eObject, null));

         } else if (isAssociationTypeUsage(setting, eObject)) {
            this.append(new RemoveAssociationCompoundCommand(domain, modelUri, (Association) eObject));
         }
      }
   }

   protected boolean isPropertyTypeUsage(final Setting setting, final EObject eObject, final Class classToRemove) {
      return eObject instanceof Property
         && eObject.eContainer() instanceof Class
         && setting.getEStructuralFeature().equals(UMLPackage.Literals.TYPED_ELEMENT__TYPE)
         && classToRemove.equals(((Property) eObject).getType());
   }

   protected boolean isAssociationTypeUsage(final Setting setting, final EObject eObject) {
      return eObject instanceof Property
         && eObject.eContainer() instanceof Association
         && ((Property) eObject).getAssociation() != null;
   }
}
