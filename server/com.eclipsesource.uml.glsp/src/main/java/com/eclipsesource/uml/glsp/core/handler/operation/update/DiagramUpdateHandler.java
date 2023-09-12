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
package com.eclipsesource.uml.glsp.core.handler.operation.update;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;

public interface DiagramUpdateHandler<TElement extends EObject> {
   Set<Class<? extends TElement>> getElementTypes();

   void handleUpdate(final UpdateOperation operation, TElement element);
}
