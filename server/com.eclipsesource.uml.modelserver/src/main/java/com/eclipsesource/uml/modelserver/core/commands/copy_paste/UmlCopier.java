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
import java.util.Iterator;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.eclipse.emf.ecore.util.EcoreUtil.Copier;
import org.eclipse.emf.ecore.util.InternalEList;

public class UmlCopier extends Copier {
   protected Set<CopyBehaviorInfluencer> behaviorInfluencer = Set.of();
   protected Collection<? extends EObject> eObjects = Set.of();

   public <T extends EObject> Collection<T> copyAll(final Collection<T> eObjects,
      final Set<CopyBehaviorInfluencer> behaviorInfluencer) {
      this.eObjects = eObjects;
      this.behaviorInfluencer = behaviorInfluencer;

      var elements = super.copyAll(eObjects);

      this.eObjects = Set.of();
      this.behaviorInfluencer = Set.of();
      return elements;
   }

   @Override
   public EObject copy(final EObject eObject) {
      if (this.behaviorInfluencer.size() > 0
         && this.behaviorInfluencer.stream().anyMatch(i -> i.shouldIgnore(this.eObjects, eObject))) {
         return null;
      }

      return super.copy(eObject);
   }

   /**
    * Fix required so that no duplicates are added to the lists
    */
   @Override
   protected void copyReference(final EReference eReference, final EObject eObject, final EObject copyEObject) {
      if (eObject.eIsSet(eReference)) {
         EStructuralFeature.Setting setting = getTarget(eReference, eObject, copyEObject);
         if (setting != null) {
            Object value = eObject.eGet(eReference, resolveProxies);
            if (eReference.isMany()) {
               @SuppressWarnings("unchecked")
               InternalEList<EObject> source = (InternalEList<EObject>) value;
               @SuppressWarnings("unchecked")
               InternalEList<EObject> target = (InternalEList<EObject>) setting;

               if (source.isEmpty()) {
                  target.clear();
               } else {
                  boolean isBidirectional = eReference.getEOpposite() != null;
                  int index = 0;
                  for (Iterator<EObject> k = resolveProxies ? source.iterator() : source.basicIterator(); k
                     .hasNext();) {
                     EObject referencedEObject = k.next();
                     EObject copyReferencedEObject = get(referencedEObject);
                     if (copyReferencedEObject == null) {
                        if (useOriginalReferences && !isBidirectional) {
                           target.addUnique(index, referencedEObject);
                           ++index;
                        }
                     } else {
                        if (isBidirectional) {
                           int position = target.indexOf(copyReferencedEObject);
                           if (position == -1) {
                              target.addUnique(index, copyReferencedEObject);
                           } else if (index != position) {
                              target.move(index, copyReferencedEObject);
                           }
                        } else {
                           // FIX
                           if (!target.contains(copyReferencedEObject)) {
                              target.addUnique(index, copyReferencedEObject);
                           }
                        }
                        ++index;
                     }
                  }
               }
            } else {
               if (value == null) {
                  setting.set(null);
               } else {
                  Object copyReferencedEObject = get(value);
                  if (copyReferencedEObject == null) {
                     if (useOriginalReferences && eReference.getEOpposite() == null) {
                        setting.set(value);
                     }
                  } else {
                     setting.set(copyReferencedEObject);
                  }
               }
            }
         }
      }
   }
}
