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
package com.eclipsesource.uml.modelserver.uml.behavior.copy_paste;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.server.emf.model.notation.Edge;

import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlEcoreReferencesUtil;
import com.eclipsesource.uml.modelserver.uml.command.copy_paste.CopyPasteBehavior;
import com.eclipsesource.uml.modelserver.uml.command.copy_paste.UmlCopier;

public class NotMarkedEdgesCopyBehavior implements CopyPasteBehavior {

   protected final NotationElementAccessor notationAccessor;

   public NotMarkedEdgesCopyBehavior(final ModelContext context) {
      this.notationAccessor = new NotationElementAccessor(context);
   }

   @Override
   public boolean shouldSuspend(final ModelContext context, final UmlCopier copier, final EObject original) {
      var notation = this.notationAccessor.getElement(original);
      if (notation.isPresent()) {
         var notationElement = notation.get();
         if (notationElement instanceof Edge) {
            return true;
         }
      }

      return false;
   }

   @Override
   public boolean removeFromSuspension(final ModelContext context, final UmlCopier copier, final EObject original) {
      var notation = this.notationAccessor.getElement(original);

      if (notation.isPresent()) {
         var notationElement = notation.get();
         if (notationElement instanceof Edge) {
            var isSelected = copier.getSelectedElements().contains(original);
            var isParentPackage = original.eContainer() instanceof org.eclipse.uml2.uml.Package
               && UmlEcoreReferencesUtil.hasAllReferencesAvailable(copier, original);
            var isParentNonRoot = !copier.getElementsToCopy().contains(original.eContainer())
               && EcoreUtil.isAncestor(copier.getElementsToCopy(), original.eContainer())
               && UmlEcoreReferencesUtil.hasAllReferencesAvailable(copier, original);
            return isSelected || isParentPackage || isParentNonRoot;
         }
      }

      return false;

   }
}
