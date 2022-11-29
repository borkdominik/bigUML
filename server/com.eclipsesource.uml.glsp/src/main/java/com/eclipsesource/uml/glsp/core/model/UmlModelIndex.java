/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.model;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.util.RootAdapterUtil;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.glsp.server.emf.notation.EMFNotationModelIndex;
import org.eclipse.glsp.server.emf.notation.EMFSemanticIdConverter;

public class UmlModelIndex extends EMFNotationModelIndex {

   protected UmlModelIndex(final EObject target, final EMFSemanticIdConverter idConverter) {
      super(target, idConverter);
   }

   @Override
   public Diagram indexAll(final Diagram diagram, final EObject semanticModel) {
      var indexedDiagram = super.indexAll(diagram, semanticModel);
      resolveModel(semanticModel);

      return indexedDiagram;
   }

   protected void resolveModel(final EObject semanticModel) {
      findUnresolvedSemanticElements(semanticModel)
         .forEach(element -> indexEObject(element));
   }

   protected List<EObject> findUnresolvedSemanticElements(final EObject semanticElement) {
      List<EObject> unresolved = new ArrayList<>();
      if (!eObjectIndex.containsValue(semanticElement)) {
         unresolved.add(semanticElement);
      }

      semanticElement.eContents().stream()
         .map(c -> findUnresolvedSemanticElements(c))
         .forEach(unresolved::addAll);

      return unresolved;
   }

   public static UmlModelIndex getOrCreate(final GModelElement element,
      final EMFSemanticIdConverter idGenerator) {
      return RootAdapterUtil.getOrCreate(element, root -> new UmlModelIndex(root, idGenerator),
         UmlModelIndex.class);
   }
}
