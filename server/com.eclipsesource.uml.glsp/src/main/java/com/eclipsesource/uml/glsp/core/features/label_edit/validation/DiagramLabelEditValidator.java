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
package com.eclipsesource.uml.glsp.core.features.label_edit.validation;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;

public interface DiagramLabelEditValidator<TElementType extends EObject> {
   Class<TElementType> getElementType();

   default Set<Class<? extends TElementType>> getElementTypes() { return Set.of(); }

   ValidationStatus validate(final String label, GModelElement source, EObject object);
}
