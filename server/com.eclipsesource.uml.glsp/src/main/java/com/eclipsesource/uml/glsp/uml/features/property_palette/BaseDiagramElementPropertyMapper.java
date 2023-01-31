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

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateHandlerOperationMapper;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.glsp.features.property_palette.model.ElementPropertyBuilder;
import com.eclipsesource.uml.glsp.features.property_palette.model.UpdateElementPropertyUpdateOperationBuilder;
import com.google.inject.Inject;

public abstract class BaseDiagramElementPropertyMapper<TElementType extends EObject>
   implements DiagramElementPropertyMapper<TElementType> {

   protected final Class<TElementType> elementType;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected EMFIdGenerator idGenerator;

   @Inject
   protected UpdateHandlerOperationMapper handlerMapper;

   public BaseDiagramElementPropertyMapper() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseDiagramElementPropertyMapper.class, 0);
   }

   @Override
   public Class<TElementType> getElementType() { return elementType; }

   protected ElementPropertyBuilder propertyBuilder(final String elementId) {
      return new ElementPropertyBuilder(elementId);
   }

   protected UpdateElementPropertyUpdateOperationBuilder<TElementType> operationBuilder() {
      return new UpdateElementPropertyUpdateOperationBuilder<>(this.modelState, this.elementType);
   }
}
