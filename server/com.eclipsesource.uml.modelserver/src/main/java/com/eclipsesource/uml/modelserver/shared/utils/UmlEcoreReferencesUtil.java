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
package com.eclipsesource.uml.modelserver.shared.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.eclipse.emf.ecore.InternalEObject;

import com.eclipsesource.uml.modelserver.core.commands.copy_paste.UmlCopier;

public class UmlEcoreReferencesUtil {
   public static boolean areReferencesAccessible(final UmlCopier copier, final EObject original) {
      var references = getReferences(original);
      for (var reference : references) {
         if (original.eIsSet(reference)) {
            var setting = ((InternalEObject) original).eSetting(reference);
            if (setting != null) {
               var value = original.eGet(reference, true);
               if (reference.isMany()) {
                  @SuppressWarnings("unchecked")
                  Collection<EObject> collection = (Collection<EObject>) value;
                  for (var eObject : collection) {
                     if (!copier.containsKey(eObject)) {
                        return false;
                     }
                  }
               } else {
                  if (!copier.containsKey(value)) {
                     return false;
                  }
               }
            }
         }
      }

      return true;
   }

   public static List<EStructuralFeature> getReferences(final EObject object) {
      var references = new ArrayList<EStructuralFeature>();

      var eClass = object.eClass();
      for (int j = 0, size = eClass.getFeatureCount(); j < size; ++j) {
         var eStructuralFeature = eClass.getEStructuralFeature(j);
         if (eStructuralFeature.isChangeable() && !eStructuralFeature.isDerived()) {
            if (eStructuralFeature instanceof EReference) {
               var eReference = (EReference) eStructuralFeature;
               if (!eReference.isContainment() && !eReference.isContainer()) {
                  references.add(eReference);
               }
            }
         }
      }

      return references;
   }
}
