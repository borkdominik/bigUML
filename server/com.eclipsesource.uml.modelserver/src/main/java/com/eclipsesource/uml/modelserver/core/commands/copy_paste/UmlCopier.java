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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil.Copier;
import org.eclipse.emf.ecore.util.InternalEList;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class UmlCopier extends Copier {

   protected final ModelContext context;
   protected final Set<CopyBehavior> copyBehaviors;
   protected final Collection<? extends EObject> elementsToCopy;
   protected final Collection<? extends EObject> selectedElements;

   protected final List<Suspension> suspended = new ArrayList<>();

   public ModelContext getContext() { return context; }

   public Set<CopyBehavior> getCopyBehaviors() { return copyBehaviors; }

   public Collection<? extends EObject> getElementsToCopy() { return elementsToCopy; }

   public Collection<? extends EObject> getSelectedElements() { return selectedElements; }

   public UmlCopier(final ModelContext context) {
      this(context, Set.of(), Set.of(), Set.of());
   }

   public UmlCopier(final ModelContext context, final Set<CopyBehavior> copyBehaviors,
      final Collection<? extends EObject> elementsToCopy,
      final Collection<? extends EObject> selectedElements) {
      this.context = context;
      this.copyBehaviors = copyBehaviors;
      this.elementsToCopy = elementsToCopy;
      this.selectedElements = selectedElements;
   }

   @Override
   protected void copyContainment(final EReference eReference, final EObject eObject, final EObject copyEObject) {
      if (eObject.eIsSet(eReference)) {
         var setting = getTarget(eReference, eObject, copyEObject);
         if (setting != null) {
            var value = eObject.eGet(eReference);
            if (eReference.isMany()) {
               @SuppressWarnings("unchecked")
               var target = (List<EObject>) value;

               var problem = target.stream().filter(t -> copyBehaviors.stream()
                  .anyMatch(b -> b.shouldSuspend(this, t))).collect(Collectors.toList());
               var unproblematic = new ArrayList<>(target);
               unproblematic.removeAll(problem);

               if (problem.size() > 0) {
                  this.suspended.add(new Suspension(eObject, copyEObject, eReference, setting, target, problem));
               }

               setting.set(copyAll(unproblematic));
            } else {
               setting.set(copy((EObject) value));
            }
         }
      }
   }

   public void analyzeSuspended() {
      var analyzing = true;

      while (analyzing) {
         suspended.forEach(s -> {
            var problem = s.problem;

            if (problem instanceof List) {
               var list = (List<EObject>) problem;

               list.removeIf(e -> this.copyBehaviors.stream()
                  .anyMatch(c -> c.removeFromSuspension(this, e)));
               var newValues = new ArrayList<Object>((List) s.value);
               newValues.removeAll(list);
               s.value = newValues;
            }
         });
         var retakes = new ArrayList<>(suspended);
         suspended.clear();
         retakes.forEach(this::retake);

         analyzing = suspended.size() > 0;
      }

   }

   protected void retake(final Suspension suspension) {
      var eReference = suspension.reference;
      var value = suspension.value;
      var setting = suspension.setting;

      if (eReference.isMany()) {
         @SuppressWarnings("unchecked")
         var target = (List<EObject>) value;
         setting.set(copyAll(target));
      } else {
         setting.set(copy((EObject) value));
      }
   }

   public void copyReferences(final Consumer<Set<CopyBehavior>> consumers) {
      super.copyReferences();
      consumers.accept(copyBehaviors);
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

   public static class Suspension {
      public final EObject original;
      public final EObject copy;
      public final EReference reference;
      public final Setting setting;
      public Object value;
      public Object problem;

      public Suspension(final EObject original, final EObject copy, final EReference reference, final Setting setting,
         final Object value, final Object problem) {
         super();
         this.original = original;
         this.copy = copy;
         this.reference = reference;
         this.setting = setting;
         this.value = value;
         this.problem = problem;
      }
   }
}
