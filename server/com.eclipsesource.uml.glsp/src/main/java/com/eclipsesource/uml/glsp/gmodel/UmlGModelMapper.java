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
package com.eclipsesource.uml.glsp.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.utils.reflection.GenericsUtil;

public interface UmlGModelMapper<T extends EObject, E extends GModelElement> {
   E map(T object);

   @SuppressWarnings({ "unchecked" })
   default Class<T> deriveEObjectType() {
      return (Class<T>) (GenericsUtil.getInterfaceParameterType(getClass(), UmlGModelMapper.class))
         .getActualTypeArguments()[0];
   }
}
