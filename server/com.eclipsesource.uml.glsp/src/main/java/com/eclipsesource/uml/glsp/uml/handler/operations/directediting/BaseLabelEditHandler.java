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
package com.eclipsesource.uml.glsp.uml.handler.operations.directediting;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.features.idgenerator.SuffixIdExtractor;
import com.eclipsesource.uml.glsp.core.handler.operation.directediting.DiagramLabelEditHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class BaseLabelEditHandler<T extends EObject> implements DiagramLabelEditHandler<T> {
   protected final Class<T> elementType;
   protected final String labelType;
   protected final String labelSuffix;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   private SuffixIdExtractor suffixIdExtractor;

   public BaseLabelEditHandler(final String labelType, final String labelSuffix) {
      this.labelType = labelType;
      this.labelSuffix = labelSuffix;
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseLabelEditHandler.class, 0);
   }

   @Override
   public Class<T> getElementType() { return elementType; }

   @Override
   public String getLabelType() { return this.labelType; }

   @Override
   public String getLabelSuffix() { return labelSuffix; }

   @Override
   public void executeLabelEdit(final ApplyLabelEditOperation editLabelOperation) {
      var labelId = editLabelOperation.getLabelId();
      var newText = editLabelOperation.getText();

      var elementId = suffixIdExtractor.extractId(labelId)
         .orElseThrow(() -> new GLSPServerException("No elementId found by extractor for label " + labelId));

      var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
         elementType,
         "Could not find semantic element for id '" + elementId + "'.");

      var command = command(semanticElement, newText);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command if " + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand command(T element, String newText);
}
