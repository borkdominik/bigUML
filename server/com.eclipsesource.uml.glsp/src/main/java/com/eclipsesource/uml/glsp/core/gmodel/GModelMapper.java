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
package com.eclipsesource.uml.glsp.core.gmodel;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

public interface GModelMapper<Source extends EObject, Target extends GModelElement> {
   Target map(Source source);

   default List<GModelElement> mapSiblings(final Source source) {
      return List.of();
   }

   Class<Source> getSourceType();

   Class<Target> getTargetType();
}
