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
package com.eclipsesource.uml.modelserver.core.commands.copy_paste;

import java.util.Collection;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.emf.ecore.util.FeatureMapUtil;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseSemanticElementCommand;

public class UmlPasteSemanticElementCommand extends BaseSemanticElementCommand {

   protected final Element copyElement;
   protected final Element originalElement;

   public UmlPasteSemanticElementCommand(final ModelContext context, final Element original,
      final Element copyElement) {
      super(context);

      this.originalElement = original;
      this.copyElement = copyElement;
   }

   @Override
   protected void doExecute() {
      var target = originalElement.getOwner();
      var feature = getTargetFeature(target, originalElement);

      if (feature == null) {
         throw new IllegalStateException("Owner of original element has not provided a feature reference");
      }

      if (FeatureMapUtil.isMany(target, feature)) {
         var list = ((Collection<EObject>) target.eGet(feature));
         list.add(copyElement);
      } else {
         target.eSet(feature, copyElement);
      }
   }

   protected EReference getTargetFeature(final EObject target, final EObject element) {
      var oldContainmentFeature = element.eContainmentFeature();

      if (target.eClass().getEAllReferences().contains(
         oldContainmentFeature)) {
         return oldContainmentFeature;
      }

      return null;
   }
}
