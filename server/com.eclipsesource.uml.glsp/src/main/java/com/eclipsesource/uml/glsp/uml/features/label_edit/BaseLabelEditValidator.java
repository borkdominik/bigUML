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
package com.eclipsesource.uml.glsp.uml.features.label_edit;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.core.features.label_edit.validation.DiagramLabelEditValidator;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.ReflectionUtil;
import com.google.inject.Inject;

public abstract class BaseLabelEditValidator<TElementType extends Element>
   implements DiagramLabelEditValidator<TElementType> {
   protected final Class<TElementType> elementType;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected Suffix suffix;

   public BaseLabelEditValidator() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseLabelEditValidator.class, 0);
   }

   @Override
   public Class<TElementType> getElementType() { return elementType; }

   @Override
   public ValidationStatus validate(final String label, final GModelElement source, final EObject element) {
      TElementType semanticElement = ReflectionUtil.castOrThrow(element,
         elementType,
         "Object is not castable to " + elementType.getName() + ". it was " + element.getClass().getName());

      return validateLabelEdit(label, source, semanticElement);
   }

   protected abstract ValidationStatus validateLabelEdit(String label, GModelElement source, TElementType element);

   protected boolean matches(final GModelElement source, final String type, final String suffix) {
      var extractedSuffix = this.suffix.extractSuffix(source.getId())
         .orElseThrow(() -> new GLSPServerException("No suffix found by extractor for source id " + source.getId()));

      return source.getType().equals(type) && extractedSuffix.equals(suffix);
   }
}
