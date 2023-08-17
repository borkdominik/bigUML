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
package com.eclipsesource.uml.modelserver.uml.command;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.eclipsesource.uml.modelserver.uml.command.create.CreateCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteCommandProvider;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateCommandProvider;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class ElementCommandProvider<TElement extends EObject>
   implements CreateCommandProvider<TElement>, DeleteCommandProvider<TElement>, UpdateCommandProvider<TElement> {
   @Inject
   protected TypeLiteral<TElement> elementType;

   @Override
   public Class<? extends EObject> getElementType() { return Type.clazz(elementType); }
}
