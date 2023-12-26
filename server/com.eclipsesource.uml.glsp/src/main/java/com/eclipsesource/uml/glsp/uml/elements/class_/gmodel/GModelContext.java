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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel;

import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;
import com.google.inject.Inject;

public class GModelContext
   implements GIdGeneratorProvider, GIdContextGeneratorProvider, GSuffixProvider,
   GModelMapHandlerProvider {

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   protected Suffix suffix;

   @Inject
   protected GModelMapHandler mapHandler;

   @Inject
   protected IdCountContextGenerator idCountGenerator;

   public UmlModelState modelState() {
      return modelState;
   }

   @Override
   public IdCountContextGenerator idContextGenerator() {
      return idCountGenerator;
   }

   @Override
   public Suffix suffix() {
      return suffix;
   }

   @Override
   public EMFIdGenerator idGenerator() {
      return idGenerator;
   }

   @Override
   public GModelMapHandler gmodelMapHandler() {
      return mapHandler;
   }

}
