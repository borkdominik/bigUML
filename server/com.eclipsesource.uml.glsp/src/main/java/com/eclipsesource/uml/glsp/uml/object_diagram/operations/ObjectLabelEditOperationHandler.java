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
package com.eclipsesource.uml.glsp.uml.object_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Constraint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.object_diagram.ObjectModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;

public class ObjectLabelEditOperationHandler
   extends EMSBasicOperationHandler<ApplyLabelEditOperation, ObjectModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final ApplyLabelEditOperation editLabelOperation,
      final ObjectModelServerAccess modelAccess) {
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
            } else if (semanticElement instanceof InstanceSpecification) {
               modelAccess.setObjectName(modelState, (InstanceSpecification) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Object to: " + inputText);
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

         case Types.ATTRIBUTE:
            Property objectAttribute = getOrThrow(modelIndex.getSemantic(graphicalElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");

            String attributeName = getNameFromInput(inputText);
            String attributeType = getTypeFromInput(inputText);
            String attributeBounds = getBoundsFromInput(inputText);

            modelAccess.setAttribute(modelState, objectAttribute, attributeName, attributeType, attributeBounds)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Attribute to: " + inputText);
                  }
               });

            break;
      }
   }

   @Override
   public String getLabel() { return "Apply label"; }

   private String typeRegex() {
      return "\\:";
   }

   private String multiplicityRegex() {
      return "\\[(.*?)\\]";
   }

   private String getNameFromInput(final String inputText) {
      String name = inputText;
      Pattern pattern = Pattern.compile(typeRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         name = inputText.split(typeRegex())[0];
      }
      return name.replaceAll(multiplicityRegex(), "").trim();
   }

   private String getTypeFromInput(final String inputText) {
      String type = "";
      Pattern pattern = Pattern.compile(typeRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         type = inputText.split(typeRegex())[1];
      }
      return type.replaceAll(multiplicityRegex(), "").trim();
   }

   private String getBoundsFromInput(final String inputText) {
      String bounds = "";
      Pattern pattern = Pattern.compile(multiplicityRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         bounds = matcher.group(1);
      }
      return bounds.trim();
   }

}
