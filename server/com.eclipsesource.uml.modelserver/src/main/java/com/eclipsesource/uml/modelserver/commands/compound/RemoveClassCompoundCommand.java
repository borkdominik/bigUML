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
package com.eclipsesource.uml.modelserver.commands.compound;

import java.util.Collection;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.commands.notation.RemoveClassShapeCommand;
import com.eclipsesource.uml.modelserver.commands.semantic.RemoveClassCommand;
import com.eclipsesource.uml.modelserver.commands.semantic.SetPropertyTypeCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveClassCompoundCommand extends CompoundCommand {

   public RemoveClassCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      this.append(new RemoveClassCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveClassShapeCommand(domain, modelUri, semanticUriFragment));

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      Class classToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Class.class);

      Collection<Setting> usagesClass = UsageCrossReferencer.find(classToRemove, umlModel.eResource());
      for (Setting setting : usagesClass) {
         EObject eObject = setting.getEObject();
         if (isPropertyTypeUsage(setting, eObject, classToRemove)) {
            String propertyUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment((Property) eObject);
            this.append(new SetPropertyTypeCommand(domain, modelUri, propertyUriFragment, null));
         } else if (isAssociationTypeUsage(setting, eObject)) {
            String associationUriFragment = UmlNotationCommandUtil
               .getSemanticProxyUri((Association) eObject.eContainer());
            this.append(new RemoveAssociationCompoundCommand(domain, modelUri, associationUriFragment));
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
