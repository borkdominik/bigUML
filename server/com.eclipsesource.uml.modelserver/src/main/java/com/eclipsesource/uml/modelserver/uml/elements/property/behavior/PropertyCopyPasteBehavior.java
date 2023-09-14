/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.property.behavior;

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.copy_paste.BaseElementCopyPasteBehavior;
import com.eclipsesource.uml.modelserver.uml.command.copy_paste.UmlCopier;

public class PropertyCopyPasteBehavior extends BaseElementCopyPasteBehavior<Property> {

   @Override
   protected boolean shouldSuspendElement(final ModelContext context, final UmlCopier copier,
      final Property element) {
      return element.getAssociation() != null;
   }

   @Override
   protected boolean removeElementFromSuspension(final ModelContext context, final UmlCopier copier,
      final Property element) {
      var association = element.getAssociation();

      if (association != null) {
         var isSelected = copier.getSelectedElements().contains(association);
         var hasAllMembers = association.getMemberEnds().stream()
            .allMatch(end -> copier.containsKey(end.getClass_()))
            && EcoreUtil.isAncestor(copier.getElementsToCopy(), association);

         return isSelected || hasAllMembers;
      }

      return false;

   }

}
