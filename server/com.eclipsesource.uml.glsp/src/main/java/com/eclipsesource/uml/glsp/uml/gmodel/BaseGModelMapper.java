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

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;

public abstract class BaseGModelMapper<Source extends EObject, Target extends GModelElement>
   implements GModelMapper<Source, Target> {

   protected final Class<Source> sourceType;
   protected final Class<Target> targetType;

   public BaseGModelMapper() {
      this.sourceType = GenericsUtil.getClassParameter(getClass(), BaseGModelMapper.class, 0);
      this.targetType = GenericsUtil.getClassParameter(getClass(), BaseGModelMapper.class, 1);

   }

   @Override
   public Class<Source> getSourceType() { return sourceType; }

   @Override
   public Class<Target> getTargetType() { return targetType; }

}
