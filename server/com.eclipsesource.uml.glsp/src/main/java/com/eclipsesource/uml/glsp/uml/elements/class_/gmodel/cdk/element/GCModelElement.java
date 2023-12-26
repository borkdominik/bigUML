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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.element;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.GComponent;

public class GCModelElement implements GComponent {
   protected final GModelContext context;
   protected final EObject source;
   protected GModelElement rootGModel;

   public GCModelElement(final GModelContext context, final EObject source) {
      this(context, source, null);
   }

   public GCModelElement(final GModelContext context, final EObject source, final GModelElement element) {
      super();
      this.context = context;
      this.source = source;
      this.rootGModel = element;
   }

   protected Optional<String> getCssIdentifier() { return Optional.empty(); }

   public GModelElement getRootGModel() { return rootGModel; }

   public void setRootGModel(final GModelElement rootGModel) { this.rootGModel = rootGModel; }

   @Override
   public GModelElement buildGModel() {
      if (rootGModel == null) {
         throw new IllegalStateException("rootGModel was null. Did you provide it?");
      }

      getCssIdentifier().ifPresent(css -> rootGModel.getCssClasses().add(css));

      return rootGModel;
   }
}
