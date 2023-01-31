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
package com.eclipsesource.uml.glsp.uml.features.label_edit;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.features.label_edit.ApplyLabelEditUpdateOperationBuilder;
import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateHandlerOperationMapper;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class BaseLabelEditMapper<TElementType extends EObject>
   implements DiagramLabelEditMapper<TElementType> {
   protected final Class<TElementType> elementType;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected Suffix suffix;

   @Inject
   protected UpdateHandlerOperationMapper handlerMapper;

   public BaseLabelEditMapper() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseLabelEditMapper.class, 0);
   }

   @Override
   public Class<TElementType> getElementType() { return elementType; }

   protected ApplyLabelEditUpdateOperationBuilder<TElementType> operationBuilder() {
      return new ApplyLabelEditUpdateOperationBuilder<>(this.modelState, this.suffix, this.elementType);
   }
}
