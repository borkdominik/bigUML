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
package com.eclipsesource.uml.glsp.manifest.contributions;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.gmodel.UmlGModelMapper;
import com.google.inject.Binder;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public interface GModelMapperContribution {

   default void contributeGModelMapper(final Binder binder) {
      var provider = Multibinder.newSetBinder(binder,
         new TypeLiteral<UmlGModelMapper<? extends EObject, ? extends GModelElement>>() {});
      contributeModelMapper(provider);
   }

   void contributeModelMapper(Multibinder<UmlGModelMapper<? extends EObject, ? extends GModelElement>> multibinder);
}
