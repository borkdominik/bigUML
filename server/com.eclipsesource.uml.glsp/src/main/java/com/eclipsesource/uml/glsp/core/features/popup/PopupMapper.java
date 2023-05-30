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
package com.eclipsesource.uml.glsp.core.features.popup;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GHtmlRoot;
import org.eclipse.glsp.server.features.popup.RequestPopupModelAction;

public interface PopupMapper<TElementType extends EObject> {
   Class<TElementType> getElementType();

   Optional<GHtmlRoot> map(final TElementType element, final RequestPopupModelAction action);
}
