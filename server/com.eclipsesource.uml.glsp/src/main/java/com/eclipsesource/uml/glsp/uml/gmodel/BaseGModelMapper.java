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
package com.eclipsesource.uml.glsp.uml.gmodel;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapHandler;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdContextGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GIdGeneratorProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GModelMapHandlerProvider;
import com.eclipsesource.uml.glsp.uml.gmodel.provider.GSuffixProvider;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class BaseGModelMapper<Source extends EObject, Target extends GModelElement>
   implements GModelMapper<Source, Target>, GIdGeneratorProvider, GIdContextGeneratorProvider, GSuffixProvider,
   GModelMapHandlerProvider {

   protected final Class<Source> sourceType;
   protected final Class<Target> targetType;

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

   public BaseGModelMapper() {
      this.sourceType = GenericsUtil.getClassParameter(getClass(), BaseGModelMapper.class, 0);
      this.targetType = GenericsUtil.getClassParameter(getClass(), BaseGModelMapper.class, 1);
   }

   @Override
   public Class<Source> getSourceType() { return sourceType; }

   @Override
   public Class<Target> getTargetType() { return targetType; }

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
