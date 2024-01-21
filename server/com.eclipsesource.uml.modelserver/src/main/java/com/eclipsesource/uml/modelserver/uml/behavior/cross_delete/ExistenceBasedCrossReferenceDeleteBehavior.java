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
package com.eclipsesource.uml.modelserver.uml.behavior.cross_delete;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

/**
 * Deletes the element if there is any reference to the deleted element
 */
public class ExistenceBasedCrossReferenceDeleteBehavior<TElement extends EObject>
   extends BaseCrossReferenceDeleteBehavior<TElement> {

   @Override
   protected boolean shouldHandle(final ModelContext context, final Setting setting, final EObject interest) {
      return getElementType().isInstance(setting.getEObject());
   }

}
