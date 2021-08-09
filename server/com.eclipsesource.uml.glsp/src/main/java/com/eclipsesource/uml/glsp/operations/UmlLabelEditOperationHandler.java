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
package com.eclipsesource.uml.glsp.operations;

import static org.eclipse.glsp.server.protocol.GLSPServerException.getOrThrow;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.protocol.GLSPServerException;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;

public class UmlLabelEditOperationHandler extends ModelServerAwareBasicOperationHandler<ApplyLabelEditOperation> {

   @Override
   public void executeOperation(final ApplyLabelEditOperation editLabelOperation, final GModelState graphicalModelState,
      final UmlModelServerAccess modelAccess) throws Exception {
      UmlModelState modelState = UmlModelState.getModelState(graphicalModelState);
      UmlModelIndex modelIndex = modelState.getIndex();

      String inputText = editLabelOperation.getText().trim();
      String graphicalElementId = editLabelOperation.getLabelId();

      GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");

      switch (label.getType()) {
         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            PackageableElement semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               PackageableElement.class, "No valid container with id " + graphicalElementId + " found");
            if (semanticElement instanceof Class) {
               modelAccess.setClassName(modelState, (Class) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not rename Class to: " + inputText);
                     }
                  });
            }
            break;

         case Types.PROPERTY:
            Property classProperty = getOrThrow(modelIndex.getSemantic(graphicalElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");

            String propertyName = getNameFromInput(inputText);
            String propertyType = getTypeFromInput(inputText);
            String propertyBounds = getBoundsFromInput(inputText);

            modelAccess.setProperty(modelState, classProperty, propertyName, propertyType, propertyBounds)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Property to: " + inputText);
                  }
               });

            break;

         case Types.LABEL_EDGE_NAME:
            containerElementId = UmlIDUtil.getElementIdFromLabelName(graphicalElementId);
            Property associationEnd = getOrThrow(modelIndex.getSemantic(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setAssociationEndName(modelState, associationEnd, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Association End Name to: " + inputText);
                  }
               });
            break;

         case Types.LABEL_EDGE_MULTIPLICITY:
            containerElementId = UmlIDUtil.getElementIdFromLabelMultiplicity(graphicalElementId);
            associationEnd = getOrThrow(modelIndex.getSemantic(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setAssociationEndMultiplicity(modelState, associationEnd, getBoundsFromInput(inputText))
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Association End Name to: " + inputText);
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
