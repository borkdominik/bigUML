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
package com.eclipsesource.uml.modelserver.uml.features.copy_paste;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.uml2.uml.Abstraction;
import org.eclipse.uml2.uml.Association;

import com.eclipsesource.uml.modelserver.core.commands.copy_paste.CopyBehavior;
import com.eclipsesource.uml.modelserver.core.commands.copy_paste.UmlCopier;
import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlEcoreReferencesUtil;

public class NotMarkedEdgesCopyBehavior implements CopyBehavior {

   protected final ModelContext context;
   protected final NotationElementAccessor notationAccessor;
   protected final Set<Class<?>> outsideElements = Set.of(Abstraction.class, Association.class);

   public NotMarkedEdgesCopyBehavior(final ModelContext context) {
      this.context = context;
      this.notationAccessor = new NotationElementAccessor(context);
   }

   @Override
   public boolean shouldSuspend(final UmlCopier copier, final EObject original) {
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
   public boolean removeFromSuspension(final UmlCopier copier, final EObject original) {
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
