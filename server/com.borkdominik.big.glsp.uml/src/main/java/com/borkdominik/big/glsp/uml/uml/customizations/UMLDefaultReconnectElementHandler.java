/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.customizations;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.DirectedRelationship;
import org.eclipse.uml2.uml.UMLPackage;

import com.borkdominik.big.glsp.server.core.commands.BGRecordingRunnableCommand;
import com.borkdominik.big.glsp.server.core.handler.operation.reconnect_edge.BGReconnectEdgeHandler;
import com.borkdominik.big.glsp.server.core.model.BGEMFModelState;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.core.model.BGTypeProviderAll;
import com.borkdominik.big.glsp.server.lib.emf.BGEcoreUtils;
import com.google.inject.Inject;

public class UMLDefaultReconnectElementHandler implements BGReconnectEdgeHandler {

   @Inject
   protected BGEMFModelState modelState;

   @Override
   public Set<BGTypeProvider> getHandledElementTypes() { return Set.of(BGTypeProviderAll.instance); }

   @Override
   public Optional<Command> handleReconnect(final ReconnectEdgeOperation operation, final EObject element) {
      var elementId = operation.getEdgeElementId();
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var semanticElement = modelState.getElementIndex().getOrThrow(elementId, EObject.class);
      var source = modelState.getElementIndex().getOrThrow(sourceId, EObject.class);
      var target = modelState.getElementIndex().getOrThrow(targetId, EObject.class);

      return doHandleReconnect(operation, semanticElement, source, target);
   }

   protected Optional<Command> doHandleReconnect(final ReconnectEdgeOperation operation, final EObject element,
      final EObject source, final EObject target) {
      return Optional.of(new BGRecordingRunnableCommand(modelState.getSemanticModel(), () -> {
         reconnectEdge(element, source, target);
      }));
   }

   protected void reconnectEdge(final EObject edge, final EObject newSource, final EObject newTarget) {
      if (edge instanceof DirectedRelationship e) {
         var sourceReferences = getReferences(edge, UMLPackage.eINSTANCE.getDirectedRelationship_Source());
         var targetReferences = getReferences(edge, UMLPackage.eINSTANCE.getDirectedRelationship_Target());

         if (sourceReferences.size() > 0) {
            BGEcoreUtils.replace(edge, sourceReferences.get(sourceReferences.size() - 1), newSource);
         }

         if (targetReferences.size() > 0) {
            BGEcoreUtils.replace(edge, targetReferences.get(targetReferences.size() - 1), newTarget);
         }

         return;
      }

      throw new GLSPServerException(
         String.format("Reconnecting edge failed for %s.",
            edge.getClass().getSimpleName()));

   }

   protected List<EReference> getReferences(final EObject edge, final EReference searchedReference) {
      var eClass = edge.eClass();
      var references = eClass.getEAllReferences();
      var filteredReferences = new ArrayList<EReference>();

      for (var reference : references) {
         if (!reference.isContainment() && reference.isChangeable()) {
            var hasSingleValue = !reference.isMany() && edge.eGet(reference) != null;
            var hasManyValue = reference.isMany() && ((Collection) edge.eGet(reference)).size() > 0;

            if ((hasSingleValue || hasManyValue) && isSubset(reference, eClass, searchedReference)) {
               filteredReferences.add(reference);
            }
         }
      }

      return filteredReferences;
   }

   protected boolean isSubset(final EReference reference, final EClass eClass, final EReference searchedReference) {
      if (reference.eContainer() != eClass && reference == searchedReference) {
         return true;
      }

      var annotation = reference.getEAnnotation("subsets");
      if (annotation == null) {
         return false;
      }

      var aReferences = annotation.getReferences();
      for (var aReference : aReferences) {
         if (aReference instanceof EReference er) {
            if (isSubset(er, eClass, searchedReference)) {
               return true;
            }
         }
      }

      return false;
   }
}
