/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.usecase_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExtensionPoint;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.usecase_diagram.UseCaseModelServerAccess;
import com.eclipsesource.uml.glsp.uml.usecase_diagram.constants.UseCaseTypes;
import com.eclipsesource.uml.glsp.utils.UmlConfig.Types;
import com.eclipsesource.uml.glsp.utils.UmlIDUtil;

public class UseCaseLabelEditOperationHandler
   extends EMSBasicOperationHandler<ApplyLabelEditOperation, UseCaseModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final ApplyLabelEditOperation editLabelOperation,
      final UseCaseModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();

      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");

      switch (label.getType()) {
         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");

            if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Package) {
               modelAccess.setPackageName(modelState, (Package) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Package to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Actor) {
               modelAccess.setActorName(modelState, (Actor) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Actor to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof UseCase) {
               modelAccess.setUseCaseName(modelState, (UseCase) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename UseCase to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof NamedElement) {
               modelAccess.renameElement(modelState, (NamedElement) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            }
            break;

         case UseCaseTypes.EXTENSIONPOINT:
            ExtensionPoint ep = getOrThrow(modelIndex.getSemantic(graphicalElementId),
               ExtensionPoint.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setExtensionPointName(modelState, ep, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change ExtensionPoint Name to: " + inputText);
                  }
               });

            break;
      }

   }

   @Override
   public String getLabel() { return "Apply label"; }
}
