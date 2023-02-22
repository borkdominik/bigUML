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
package com.eclipsesource.uml.modelserver.shared.semantic;

import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;

import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.model.OrderPosition;

public interface OrderablePositionSemantic {

   /**
    * Works only if the movements are to a single direction
    *
    * @param <TElement> Type of element
    * @param elements   The elements that need to be ordered
    * @param positions  The new positions
    */
   default <TElement extends EObject> void reorder(final EList<TElement> elements,
      final List<OrderPosition> positions) {
      var queue = new LinkedBlockingQueue<TElement>();

      positions.sort((a, b) -> a.oldPosition - b.oldPosition);

      if (positions.size() > 1) {
         if (positions.get(0).oldPosition < positions.get(0).newPosition) {
            positions.sort((a, b) -> b.oldPosition - a.oldPosition);
         }
      }

      positions.forEach(order -> {
         queue.add(elements.get(order.oldPosition));
      });

      positions.forEach(order -> {
         var element = queue.poll();
         var newPosition = order.newPosition;

         if (newPosition >= elements.size()) {
            elements.move(elements.size() - 1, 0);
            elements.move(0, element);
         } else if (newPosition < 0) {
            elements.move(0, elements.size() - 1);
            elements.move(elements.size() - 1, element);
         } else {
            elements.move(newPosition, element);
         }

      });

   }
}
