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
package com.eclipsesource.uml.glsp.uml.features.property_palette;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.google.inject.Inject;

public abstract class BaseDiagramElementPropertyMapper<Source extends EObject>
   implements DiagramElementPropertyMapper<Source> {

   protected final Class<Source> sourceType;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected EMFIdGenerator idGenerator;

   public BaseDiagramElementPropertyMapper() {
      this.sourceType = GenericsUtil.getClassParameter(getClass(), BaseDiagramElementPropertyMapper.class, 0);
   }

   @Override
   public Class<Source> getSourceType() { return sourceType; }

}
